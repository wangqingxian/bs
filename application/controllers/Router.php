<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2017/3/6
 * Time: 9:23
 */
use League\Flysystem\Filesystem;
use League\Flysystem\Adapter\Local;

class Router extends Authox_Controller
{
    private $adapter;
    private $file;

    public function __construct()
    {
        $this->authox_start=true;
        parent::__construct();
        $this->adapter = new Local(FCPATH."user/");
        $this->file = new Filesystem($this->adapter);
    }

    function set_index()
    {
        $input=json_decode($this->input->raw_input_stream,true);

        if(!is_array($input)||empty($input))
        {
            exit(json_decode(array(
                "status"=>false,
                "message"=>"参数错误"
            )));
        }

        $url=array_key_exists("url",$input)?$input["url"]:"";

        if(empty($url))
        {
            exit(json_decode(array(
                "status"=>false,
                "message"=>"参数错误"
            )));
        }

        $app_js="app.js.json";
        $router_config="router.config.json";

        if($this->file->has($app_js))
        {
            $app=$this->file->read($app_js);
            $app=json_decode($app,true);
            $app["config"]["when"]=$url;

            $this->file->put($app_js,json_encode($app));
        }
        else
        {
            $app=array();
            $app["config"]["when"]=$url;
            $this->file->put($app_js,json_encode($app));
        }

        if($this->file->has($router_config))
        {
            $router=$this->file->read($router_config);
            $router=json_decode($router,true);
            $router["index"]=$url;

            $this->file->put($router_config,json_encode($router));
        }
        else
        {
            $router=array();
            $router["index"]=$url;

            $this->file->put($router_config,json_encode($router));
        }

        $this->_re();

        echo json_encode(array(
            "status"=>true,
            "message"=>"设置首页成功"
        ));
    }

    /**
     * 根据app.js.json生成app.js
     * 未完成
     */
    private function _re()
    {
        $app_js="app.js.json";
        if($this->file->has($app_js))
        {
            $app=$this->file->read($app_js);
            $app=json_decode($app,true);
            $this->load->helper("app_js");
            $this->file->put("app.js",app_js($app));
        }
    }

    /**
     * 路由配置
     * router.config.json  保存路由信息
     * 已添加
     * 未测试
     * 未完成
     */
    function add()
    {
        $data=$data=json_decode(json_encode(json_decode($this->input->raw_input_stream)),true);

        if(!is_array($data))
        {
            exit(json_encode(array(
                "status"=>false,
                "message"=>"参数错误"
            )));
        }
        $router=array();
        $router["name"]=array_key_exists("name",$data)?strtolower($data["name"]):"";
        $router["url"]=array_key_exists("url",$data)?$data["url"]:array();
        $router["template"]=array_key_exists("template",$data)?$data["template"]:"";

        if(empty($router["name"])||empty($router["url"])||!is_array($router["url"])||empty($router["template"]))
        {
            exit(json_encode(array(
                "status"=>false,
                "message"=>"参数错误"
            )));

        }
        $len=count($router["url"]);
        $url="";
        for($i=0;$i<$len;$i++)
        {
            $url="/".$router["url"][$i];
        }

        if($this->file->has("router.config.json")&&$this->file->has("app.js.json"))
        {
            if(!$this->file->has($router["template"].".html"))
            {
                $this->file->put($router["template"].".html","");
                $this->file->put($router["template"].".json","[]");
                $this->file->put($router["template"].".js","");
            }

            $contents=$this->file->read("router.config.json");
            $contents=json_decode($contents,true);
            if(!empty($contents["state"]))
            {
                $names=array_column($contents["state"],"name");
                $urls=array_column($contents["state"],"url");
            }


            if(!empty($urls)&&in_array($url,$urls,true))
            {
                exit(json_encode(array(
                    "status"=>false,
                    "message"=>"url路径不可重复"
                )));
            }
            if(!empty($names)&&in_array($router["name"],$names,true))
            {
//                foreach ($contents["state"] as $item)
//                {
//                    if($item["name"]==$router['name'])
//                    {
//                        $item["name"]=$router["name"];
//                        $item["url"]=$url;
//                        $item["template"]=$router["template"]
//                        break;
//                    }
//                }
                exit(json_encode(array(
                    "status"=>false,
                    "message"=>"路由名称不可重复"
                )));
            }
            else
            {
                array_push($contents['state'],array(
                    "name"=>$router["name"],
                    "url"=>$url,
                    "template"=>$router["template"]
                ));
            }

            if(empty($contents["state"]))
            {
                $contents["state"]=array();
            }
            $this->file->put("router.config.json",json_encode($contents));
            $app=$this->file->read("app.js.json");
            $app=json_decode($app,true);
            $app["config"]["state"]=$contents["state"];
            $this->file->put("app.js.json",json_encode($app));

            $back=array(
                "status"=>true,
                "message"=>"配置成功"
            );
        }
        else
        {
            $contents=array(
                "state"=>array(
                    array(
                        "name"=>$router["name"],
                        "url"=>$url,
                        "template"=>$router["template"]
                    )
                )
            );
            $this->file->put("router.config.json",json_encode($contents));
            $this->file->put("app.js.json",json_encode(array("config"=>$contents)));
            $this->file->put($router["name"].".html","");
            $this->file->put($router["name"].".json","{}");
            $this->file->put($router["name"].".js",
                "angular.module(\"ac\").controller(\"".$router['name']."\",function(\$scope){})");

            $back=array(
                "status"=>true,
                "message"=>"添加成功"
            );
        }
        //重新生成app.js;
        $this->_re();
        echo json_encode($back);
    }

    /**
     * 初始化html文件
     * 路由配置只能配置已存在的html
     * 所以必须先初始化html和js文件
     * 默认各文件和路由设计重名
     * xxx.html  初始化的html模版
     * xxx.js   初始化的js 脚本
     * xxx.json 记录xxx.js内部结构组成的json配置文件
     *             对js的文件进行的修改都是对json配置进行修改，
     *             再按照json文件重新生成js脚本
     * 未添加
     * 未测试
     * 未完成
     */





    /**
     * 删除html文件
     * 可以删除路由配置
     * 也可以删除html+js+json
     * （默认都同名）
     * 可以选择值删除路由
     * 也可以选择同时删除路由和html+js+json文件
     * data={
     *      name:""   路由名称，
     *      real:""   是否同时删除路由和模版    "true"  "false"  值并非boolean值
     * }
     * 已添加
     */
    function delete()
    {
        $data=$data=json_decode(json_encode(json_decode($this->input->raw_input_stream)),true);

        if(!is_array($data))
        {
            exit(json_encode(array(
                "status"=>false,
                "message"=>"参数错误"
            )));
        }

        $delete=array();
        $delete["name"]=array_key_exists("name",$data)?strtolower($data["name"]):"";
        $delete["real"]=array_key_exists("real",$data)?$data["real"]:'false';

        if(empty($delete["name"])||empty($delete["real"]))
        {
            exit(json_encode(array(
                "status"=>false,
                "message"=>"参数错误"
            )));
        }

        if(!($delete["real"]==="true"||$delete["real"]==="false"))
        {
            exit(json_encode(array(
                "status"=>false,
                "message"=>"参数错误"
            )));
        }

        if($this->file->has("router.config.json")&&$this->file->has("app.js.json"))
        {
            $router=$this->file->read("router.config.json");
            $router=json_decode($router,true);
            $app=$this->file->read("app.js.json");
            $app=json_decode($app,true);
        }
        else
        {
            exit(json_encode(array(
                "status"=>false,
                "message"=>"参数错误或路由配置文件不存在"
            )));
        }

        $names=array_column($router["state"],"name");

        if(!empty($names)&&in_array($delete["name"],$names))
        {
            foreach ($router["state"] as $index=>$value)
            {
                if($value["name"]==$delete["name"])
                {
                    $del=$value;
                    array_splice($router["state"], $index, 1);
                    break;
                }

            }

            $app["config"]["state"]=$router["state"];

            $this->file->put("app.js.json",json_encode($app));
            $this->file->put("router.config.json",json_encode($router));

            $back=array(
                "status"=>true,
                "message"=>"删除成功"
            );
        }
        else
        {
            exit(json_encode(array(
                "status"=>false,
                "message"=>"该路由不存在"
            )));
        }

        if($delete["real"]==="true")
        {
            if($this->file->has($del["template"].".html"))
                $this->file->delete($del["template"].".html");
            if($this->file->has($del["template"].".json"))
                $this->file->delete($del["template"].".json");
            if($this->file->has($del["template"].".js"))
                $this->file->delete($del["template"].".js");
        }

        $this->_re();

        echo json_encode($back);
    }

    /**
     * 修改名称
     * 因为各个部分同名
     * 所以都要修改
     * 已添加
     */
    function modify()
    {
        $data=$data=json_decode(json_encode(json_decode($this->input->raw_input_stream)),true);

        if(!is_array($data))
        {
            exit(json_encode(array(
                "status"=>false,
                "message"=>"参数错误"
            )));
        }

        $modify=array();
        $modify["name"]=array_key_exists("name",$data)?strtolower($data["name"]):"";
        $modify["url"]=array_key_exists("url",$data)?$data["url"]:array();
        $modify["template"]=array_key_exists("template",$data)?$data["template"]:"";
        $modify["new"]=array_key_exists("new",$data)?$data["new"]:"";

        if(empty($modify["name"])||empty($modify["url"])||empty($modify["template"]))
        {
            exit(json_encode(array(
                "status"=>false,
                "message"=>"参数错误"
            )));
        }

        $len=count($modify["url"]);
        $url="";
        for($i=0;$i<$len;$i++)
        {
            $url="/".$modify["url"][$i];
        }

        if($this->file->has("router.config.json")&&$this->file->has("app.js.json"))
        {
            $router=$this->file->read("router.config.json");
            $router=json_decode($router,true);
            $app=$this->file->read("app.js.json");
            $app=json_decode($app,true);
        }
        else
        {
            exit(json_encode(array(
                "status"=>false,
                "message"=>"参数错误或路由配置文件不存在"
            )));
        }

        $names=array_column($router["state"],"name");

        if(!empty($names)&&in_array($modify["name"],$names))
        {
            foreach ($router["state"] as $index=>$value)
            {
                if($value["name"]==$modify["name"])
                {
                    if(!empty($modify["new"]))
                    {
                        $router["state"][$index]["name"]=$modify["new"];
                    }
                    $router["state"][$index]["url"]=$url;
                    $router["state"][$index]["template"]=$modify["template"];
                    break;
                }

            }

            $app["config"]["state"]=$router["state"];

            $this->file->put("app.js.json",json_encode($app));
            $this->file->put("router.config.json",json_encode($router));

            $back=array(
                "status"=>true,
                "message"=>"修改成功"
            );
        }
        else
        {
            exit(json_encode(array(
                "status"=>false,
                "message"=>"该路由不存在"
            )));
        }

        if(!$this->file->has($modify["template"].".html"))
            $this->file->put($modify["template"].".html","");
        if(!$this->file->has($modify["template"].".json"))
            $this->file->put($modify["template"].".json","{}");
        if(!$this->file->has($modify["template"].".js"))
            $this->file->put($modify["template"].".js",
                "angular.module(\"ac\").controller(\"".$modify['template']."\",function(\$scope){})");

        $this->_re();
        echo json_encode($back);
    }

    /**
     * 获取详情
     * 未添加
     * 未测试
     */
    function detail()
    {
        $data=$data=json_decode(json_encode(json_decode($this->input->raw_input_stream)),true);

        if(!is_array($data))
        {
            exit(json_encode(array(
                "status"=>false,
                "message"=>"参数错误"
            )));
        }

        $detail=array();
        $detail["name"]=array_key_exists("name",$data)?$data["name"]:"";

        if(empty($detail["name"]))
        {
            exit(json_encode(array(
                "status"=>false,
                "message"=>"参数错误"
            )));
        }

        if($this->file->has("router.config.json")&&$this->file->has("app.js.json"))
        {
            $router=$this->file->read("router.config.json");
            $router=json_decode($router,true);

            $names=array_column($router,"name");

            if(!empty($names)&&in_array($detail["name"],$names))
            {
                foreach($router as $k=>$v)
                {
                    if($v["name"]==$detail["name"])
                    {
                        $b=$v;
                        break;
                    }
                }
            }
            else
            {
                exit(json_encode(array(
                    "status"=>false,
                    "message"=>"配置文件异常"
                )));
            }
        }
        else
        {
            exit(json_encode(array(
                "status"=>false,
                "message"=>"参数错误或路由配置文件不存在"
            )));
        }

        $back=array(
            "status"=>true,
            "message"=>"获取成功",
            "data"=>isset($b)?$b:array()
        );

        echo json_encode($back);
    }

    /**
     * 获取路由列表 router.config.json
     * 伪装成文件列表
     * 用类似win的文件夹大图标来展示
     * font-awesome  图标file-code-o
     * 已添加
     * 未完成
     */
    function items()
    {
        $index="";
        if($this->file->has("router.config.json"))
        {
            $router=$this->file->read("router.config.json");
            $router=json_decode($router,true);
            if(array_key_exists("index",$router))
            {
                $index=$router["index"];
                foreach ($router['state'] as $k=>$v)
                {
                    if($v['url']==$index)
                    {
                        $index=$v;
                        break;
                    }
                }
            }
            $router=$router["state"];
        }
        else if($this->file->has("app.js.json"))
        {
            $router=$this->file->read("app.js.json");
            $router=json_decode($router,true);
            if(array_key_exists("when",$router["config"]))
            {
                $index=$router["config"]["when"];
                foreach ($router['config']["state"] as $k=>$v)
                {
                    if($v['url']==$index)
                    {
                        $index=$v;
                        break;
                    }
                }
            }
            $router=$router["config"]["state"];
        }
        else
        {
            exit(json_encode(array(
                "status"=>true,
                "message"=>"没有初始化",
                "index"=>$index,
                "data"=>array(),
            )));
        }

        $back=array(
            "status"=>true,
            "message"=>"获取成功",
            "index"=>$index,
            "data"=>$router
        );
        echo json_encode($back);
    }

    /**
     * 获取真是存在的模版文件
     * 未添加
     * 未测试
     */
    function template()
    {
        $files=$this->file->listContents("",true);

        $tem=array();

        foreach ($files as $file)
        {
            if($file["type"]=="file")
            {
                if($file['extension']=="html")
                {
                    array_push($tem,$file);
                }
            }
        }

        $back=array(
            "status"=>true,
            "message"=>"获取成功",
            "data"=>$tem
        );

        echo json_encode($back);
    }

    /**
     * json 配置文件
     * url链接  全部采用ui-sref={{url[xxx]}}
     * 将url数组保存在js文件内
     * 方便在router更名时进行修改
     * url数组放在app.js中最先被加载
     * url[xxx]  随机数基本不会重复
     *
     */
}