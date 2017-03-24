<?php

use League\Flysystem\Filesystem;
use League\Flysystem\Adapter\Local;

class Module extends Authox_Controller
{
    public $model_name;
    public $table_name;

    public $available;
    private $_model;
    public $model_suffix;
    public $table_pre;
    public $adapter;
    public $file;

    public function __construct()
    {
        $this->model_name="module_model";
        $_model_name=$this->model_name;
        $this->table_name="ac_module";
        $this->authox_start=true;
        $this->available=true;
        $this->authox_start=true;
        parent::__construct();
        $this->load->model($_model_name);
        $this->_model=$this->$_model_name;
        $this->load->dbforge();
        $this->table_pre=DB_TABLE_PRE;
        $this->model_suffix="_model";
        $this->adapter = new Local(APPPATH);
        $this->file = new Filesystem($this->adapter);
    }

    private function _check($table)
    {
        $reg='/\b((a(bstract|nd|rray|s))|(c(a(llable|se|tch)|l(ass|one)|on(st|tinue)))|(d(e(clare|fault)|ie|o))|(e(cho|lse(if)?|mpty|nd(declare|for(each)?|if|switch|while)|val|x(it|tends)))|(f(inal|or(each)?|unction))|(g(lobal|oto))|(i(f|mplements|n(clude(_once)?|st(anceof|eadof)|terface)|sset))|(n(amespace|ew))|(p(r(i(nt|vate)|otected)|ublic))|(re(quire(_once)?|turn))|(s(tatic|witch))|(t(hrow|r(ait|y)))|(u(nset|se))|(__halt_compiler|break|list|(x)?or|var|while)|(ci_controller|default|index|authox_controller|my_controller|api_controller|ci_model|my_model|base_model|api_model|authox|captcha|controller|group|group_detail|login|logout|manage|method|module|reload|user|welcome))\b/';
        if(preg_match($reg,strtolower($table)))
        {
            exit(json_encode(array(
                "status"=>false,
                "message"=>"模块英文名不合法"
            )));
        }
    }

    /**
     * 获取左侧菜单数据
     * 已加入
     * 已测试
     */
    public function menu()
    {
        if($back=$this->_model->menu())
        {

        }
        else
        {
            $back=$this->db->error();
            $back["status"]=false;
            if(empty($back["message"]))
            {
                $back["message"]="获取失败";
            }
        }

        echo json_encode($back);
    }

    /**
     * 修改模块是否加入左侧菜单
     * 已加入
     * 已测试
     */
    public function left()
    {
        $data=$data=json_decode(json_encode(json_decode($this->input->raw_input_stream)),true);

        if(!is_array($data))
        {
            exit(json_encode(array(
                "status"=>false,
                "message"=>"参数错误"
            )));
        }
        $input=array(
            "module_id"=>"",
            "is_left"=>""
        );
        $input["module_id"]=array_key_exists("module_id",$data)?$data["module_id"]:"";
        $input["is_left"]=array_key_exists("is_left",$data)?$data["is_left"]:"";
        if(empty($input["module_id"])||!($input["is_left"]===true||$input["is_left"]===false))
        {
            exit(json_encode(array(
                "status"=>false,
                "message"=>"参数错误"
            )));
        }
        if($this->_model->modify($input))
        {
            $back=array(
                "status"=>true,
                "message"=>"修改成功"
            );
        }
        else
        {
            $back=$this->db->error();
            $back["status"]=false;
            if (empty($back["message"]))
            {
                $back["message"]="参数错误";
            }
        }

        echo json_encode($back);
    }

    /**
     * 删除所有文件 表 ac_module中数据
     * 已加入
     * 已测试
     */
    public function delete()
    {
        $data=$data=json_decode(json_encode(json_decode($this->input->raw_input_stream)),true);

        if(!is_array($data))
        {
            exit(json_encode(array(
                "status"=>false,
                "message"=>"参数错误"
            )));
        }
        
        $input=array();
        $input["module_id"]=array_key_exists("module_id",$data)?$data["module_id"]:"";
        if(empty($input["module_id"]))
        {
            exit(json_decode(array(
                "status"=>false,
                "message"=>"参数错误"
            )));
        }

        if($back=$this->_model->detail($input))
        {
            $module=$back["data"];
            if(empty($module))
            {
                $back=array(
                    "status"=>false,
                    "message"=>"没有该数据"
                );
            }
            else
            {
                $model_base="models/base/".strtolower($module["module"])."_model";
                $controller="controllers/api/".strtolower($module["module"]).".php";
                $model="models/".strtolower($module["module"])."_model.php";
                $this->file->deleteDir($model_base);
                if($this->file->has($controller))
                {
                    $this->file->delete($controller);
                }
                if($this->file->has($model))
                {
                    $this->file->delete($model);
                }
                $this->_model->delete($input);
                $this->dbforge->drop_table($this->table_pre.$module["module"],TRUE);
                if(!$this->file->has($controller))
                {
                    $back=array(
                        "status"=>true,
                        "message"=>"删除成功"
                    );
                }
                else
                {
                    $back=array(
                        "status"=>false,
                        "message"=>"删除失败"
                    );
                }
            }
        }
        else
        {
            $back=$this->db->error();
            $back["status"]=false;
            if(empty($back["message"]))
            {
                $back["message"]="参数错误";
            }
        }
        echo json_encode($back);
    }

    /**
     * 修改模块是否启用
     * 已加入
     * 已测试
     */
    public function available()
    {
        $data=$data=json_decode(json_encode(json_decode($this->input->raw_input_stream)),true);

        if(!is_array($data))
        {
            exit(json_encode(array(
                "status"=>false,
                "message"=>"参数错误"
            )));
        }
        $input=array(
            "module_id"=>"",
            "available"=>""
        );
        $input["module_id"]=array_key_exists("module_id",$data)?$data["module_id"]:"";
        $input["available"]=array_key_exists("available",$data)?$data["available"]:"";
        $input["modify_time"]=DATE_TIME;
        $input["modify_user"]=$this->session->userdata("user_name");
        if(empty($input["module_id"])||!($input["available"]===false||$input["available"]===true))
        {
            exit(json_encode(array(
                "status"=>false,
                "message"=>"参数错误"
            )));
        }
        if($this->_model->modify($input))
        {
            $back=array(
                "status"=>true,
                "message"=>"修改成功"
            );
            $data=$this->_model->detail(array("module_id"=>$input["module_id"]));
            $data=$data["data"];
            $controller="controllers/api/".strtolower($data["module"]).".php";
            $json="models/base/".strtolower($data["module"])."_model/controller.json";
            if($this->file->has($controller)&&$this->file->has($json))
            {
                $contents=$this->file->read($json);
                $contents=json_decode($contents,true);
                $this->load->helper("api");
                $contents["construct"]["available"]=$input["available"];
                if($temp=api($contents))
                {
                    $this->file->put($controller,$temp);
                }
                else
                {
                    $this->_model->modify(array("module_id"=>$input["module_id"],"available"=>!$input["available"]));
                    $back=array(
                        "status"=>false,
                        "message"=>"修改失败"
                    );
                }
            }
            else
            {
                $back=array(
                    "status"=>false,
                    "message"=>"控制器文件缺失"
                );
            }
        }
        else
        {
            $back=$this->db->error();
            $back["status"]=false;
            if (empty($back["message"]))
            {
                $back["message"]="参数错误";
            }
        }

        echo json_encode($back);
    }

    /**
     * 向ac_module中注册模块
     * 已加入
     * 已测试
     */
    public function add()
    {
        $data=json_decode(json_encode(json_decode($this->input->raw_input_stream)),true);

        if(!is_array($data))
        {
            exit(json_encode(array(
                "status"=>false,
                "message"=>"参数错误"
            )));
        }

        $input=array();
        $input["module"]=array_key_exists("module",$data)?$data["module"]:null;
        $this->_check($input["module"]);

        $input["module_name"]=array_key_exists("module_name",$data)?$data["module_name"]:null;
        $input["modify_time"]=DATE_TIME;
        $input["modify_user"]=$this->session->userdata("user_name");
        $input["is_left"]=array_key_exists("is_left",$data)?$data["is_left"]:false;
        $input["available"]=array_key_exists("available",$data)?$data["available"]:true;

        if($this->_model->add($input))
        {
            $id=$this->db->insert_id();
            $this->_model->modify(array(
                "module_id"=>$id,
                "module_sref"=>"module.api({module:".$id."})"
            ));
            $back=array(
                "status"=>true,
                "message"=>"添加成功",
                "data"=>array()
            );
            $back["data"]["module_id"]=$id;
            $back["data"]["module"]=$input["module"];



        }
        else
        {
            $back=$this->db->error();
            $back["status"]=false;
            if(empty($back["message"]))
            {
                $back["message"]="参数错误";
            }
        }

        echo json_encode($back);
    }

    /**
     * 创建配置文件
     * 已加入
     * 已测试
     * $data   array( "table"=>"","primary_key"=>"", keys=>"", "table_keys"=>array() )
     */
    public function create()
    {
        $data=json_decode(json_encode(json_decode($this->input->raw_input_stream)),true);
        if(!is_array($data))
        {
            exit(json_encode(array(
                "status"=>false,
                "message"=>"参数错误"
            )));
        }
        if(!array_key_exists("table",$data)||!array_key_exists("primary_key",$data)
                ||!array_key_exists("table_keys",$data)||!array_key_exists("keys",$data)
                ||!array_key_exists("module_id",$data))
        {
            exit(json_encode(array(
                "status"=>false,
                "message"=>"参数错误"
            )));
        }

        $this->_check($data["table"]);

        if(!is_array($data["table_keys"])||!is_array($data["keys"])||empty($data["module_id"]))
        {
            exit(json_encode(array(
                "status"=>false,
                "message"=>"参数错误"
            )));
        }

        if($back=$this->_model->page(array("like"=>array("module_id"=>$data["module_id"],"module"=>$data['table'])),false))
        {
            if(count($back["data"])!=1)
            {
                exit(json_encode(array(
                    "status"=>false,
                    "message"=>"该模块不存在"
                )));
            }
            else
            {
                $data["table"]=strtolower($data["table"]);
                //表名 控制器名 模型名转为小写
            }
        }
        else
        {
            exit(json_encode(array(
                "status"=>false,
                "message"=>"参数错误"
            )));
        }

        if($this->db->table_exists($this->table_pre.$data["table"]))
        {
            exit(json_encode(array(
                "status"=>false,
                "message"=>"模块已存在"
            )));
        }

        $attributes = array('ENGINE' => 'InnoDB');
        $this->dbforge->add_field($data["table_keys"]);
        $this->dbforge->add_key($data["primary_key"],true);
        $this->dbforge->create_table($this->table_pre.$data["table"],false,$attributes);

        $model_base='models/base/'.$data["table"].$this->model_suffix."/";

        $this->file->put($model_base."table.json",json_encode(array("keys"=>$data["keys"],"primary"=>$data["primary_key"])));

        $entity=array_keys($data["table_keys"]);
        $this->file->put($model_base."entity.json", json_encode($entity));

        $name=array();
        foreach ($entity as $v)
        {
            @$name[$v]=isset($data["keys"][$v]["key_name"])?$data["keys"][$v]["key_name"]:"";
        }
        $this->file->put($model_base."name.json",json_encode($name));

        if($this->db->table_exists($this->table_pre.$data["table"]))
        {
            $back=array(
                "status"=>true,
                "message"=>"创建成功"
            );
        }

        echo json_encode($back);
    }

    /**
     * 分页展示ac_module中注册的模块
     * 已加入
     * 已测试
     */
    public function page()
    {
        $data=$data=json_decode(json_encode(json_decode($this->input->raw_input_stream)),true);

        if(!is_array($data))
        {
            exit(json_encode(array(
                "status"=>false,
                "message"=>"参数错误"
            )));
        }

        if($back=$this->_model->page($data))
        {

        }
        else
        {
            $back=$this->db->error();
            $back["status"]=false;
            if(empty($back["message"]))
            {
                $back["message"]="参数错误";
            }
        }

        echo json_encode($back);
    }

    /**
     * 获取ac_modeule中已注册的模块信息
     * 已加入
     * 已测试
     */
    public function detail()
    {
        $data=$data=json_decode(json_encode(json_decode($this->input->raw_input_stream)),true);

        if(!is_array($data))
        {
            exit(json_encode(array(
                "status"=>false,
                "message"=>"参数错误"
            )));
        }

        if(!array_key_exists("module_id",$data))
        {
            exit(json_encode(array(
                "status"=>false,
                "message"=>"参数错误"
            )));
        }

        if ($back=$this->_model->detail(array("module_id"=>$data["module_id"])))
        {

        }
        else
        {
            $back=$this->db->error();
            $back["status"]=false;
            if(empty($back["message"]))
            {
                $back["message"]="参数错误";
            }
        }

        echo json_encode($back);
    }

    /**
     * 获取全部信息
     * 已加入
     * 已测试
     * 还需改造加入是否已经生成文件数据库总条数
     */
    public function info()
    {
        $data=json_decode(json_encode(json_decode($this->input->raw_input_stream)),true);
        if(!is_array($data))
        {
            exit(json_encode(array(
                "status"=>false,
                "message"=>"参数错误"
            )));
        }

        if(!array_key_exists("module_id",$data))
        {
            exit(json_encode(array(
                "status"=>false,
                "message"=>"参数错误"
            )));
        }
        $info=array();
        if($detail=$this->_model->detail(array("module_id"=>$data["module_id"])))
        {
            if(empty($detail["data"]))
            {
                exit(json_encode(array(
                    "status"=>false,
                    "message"=>"该模块不存在"
                )));
            }
            else
            {
                $info=$detail["data"];
                $info["table"]=strtolower($info["module"]);
            }
        }
        else
        {
            $back=$this->db->error();
            $back["status"]=false;
            if(empty($back["message"]))
            {
                $back["message"]="参数错误";
            }
            exit(json_encode($back));
        }

        if(!$this->db->table_exists($this->table_pre.$info["table"]))
        {
            exit(json_encode(array(
                "status"=>false,
                "message"=>"该模块没有创建字段"
            )));
        }
        $table="models/base/".$info["table"]."_model/table.json";
        if($exists = $this->file->has($table))
        {
            $contents=$this->file->read($table);
            if(empty($contents))
            {
                exit(json_encode(array(
                    "status"=>false,
                    "message"=>"该模块没有保存字段"
                )));
            }
            else
            {
                $tableKeys=json_decode(json_encode(json_decode($contents)),true);
                $info["keys"]=$tableKeys["keys"];
                $info["primary"]=$tableKeys["primary"];
            }
        }
        else
        {
            exit(json_encode(array(
                "status"=>false,
                "message"=>"该模块没有创建字段"
            )));
        }

        $back=array(
            "status"=>true,
            "message"=>"获取成功",
            "data"=>$info
        );

        echo json_encode($back);

    }

    /**
     * 获取表字段信息
     * 则创建table.json则初始化一份
     * 未添加
     * 未测试
     */
    public function init()
    {
        $data=json_decode(json_encode(json_decode($this->input->raw_input_stream)),true);
        if(!is_array($data))
        {
            exit(json_encode(array(
                "status"=>false,
                "message"=>"参数错误"
            )));
        }

        if(!array_key_exists("module_id",$data))
        {
            exit(json_encode(array(
                "status"=>false,
                "message"=>"参数错误"
            )));
        }
        $info=array();
        if($detail=$this->_model->detail(array("module_id"=>$data["module_id"])))
        {
            if(empty($detail["data"]))
            {
                exit(json_encode(array(
                    "status"=>false,
                    "message"=>"该模块不存在"
                )));
            }
            else
            {
                $info=$detail["data"];
                $info["table"]=strtolower($info["module"]);
            }
        }
        else
        {
            $back=$this->db->error();
            $back["status"]=false;
            if(empty($back["message"]))
            {
                $back["message"]="参数错误";
            }
            exit(json_encode($back));
        }
        $table="models/base/".$info["table"]."_model/table.json";

        $te=$this->db->table_exists($this->table_pre.$info["table"]);
        $je=$this->file->has($table);
        if(($te==true&&$je==false)||($te==false&&$je==true))
        {
            exit(json_encode(array(
                "status"=>false,
                "message"=>"模块异常请删除后，重新创建！"
            )));
        }

        if($te&&$je)
        {
            $contents=$this->file->read($table);
            if(empty($contents))
            {
                exit(json_encode(array(
                    "status"=>false,
                    "message"=>"该模块没有保存字段"
                )));
            }
            else
            {
                $tableKeys=json_decode(json_encode(json_decode($contents)),true);
                $info["keys"]=$tableKeys["keys"];
                $info["primary"]=$tableKeys["primary"];
            }
        }
        else
        {
            $tk=array();
            $tk["keys"]=array();
            $tk["keys"][$info["table"]."_id"]=array(
                "key"=>$info["table"]."_id",
                "key_name"=>$info["table"]."自增主键",
                "primary"=> true,
                "type"=> "自增长ID",
                "form"=> "primary",
            );
            $tk["primary"]=$info["table"]."_id";
            $this->file->put($table,json_encode($tk));
            $info["keys"]=$tk["keys"];
            $info["primary"]=$tk["primary"];

            $attributes = array('ENGINE' => 'InnoDB');
            $k=array();
            $k[$info["table"]."_id"]=array(
                'type'=>"INT",
                'constraint'=>11,
                'auto_increment'=>true,
                'unsigned'=>true
            );
            $this->dbforge->add_field($k);
            $this->dbforge->add_key($tk["primary_key"],true);
            $this->dbforge->create_table($this->table_pre.$info["table"],false,$attributes);
        }

        $back=array(
            "status"=>true,
            "message"=>"获取成功",
            "data"=>$info
        );

        echo json_encode($back);

    }

    /**
     * 最后生成文件
     * 已加入
     * 已测试
     */
    public function last()
    {
        $data=json_decode(json_encode(json_decode($this->input->raw_input_stream)),true);
        //$data["module_id"]=10;
        if(!is_array($data))
        {
            exit(json_encode(array(
                "status"=>false,
                "message"=>"参数错误"
            )));
        }

        if (!array_key_exists("module_id",$data))
        {
            exit(json_encode(array(
                "status"=>false,
                "message"=>"参数错误"
            )));
        }

        if($detail=$this->_model->detail(array("module_id"=>$data["module_id"])))
        {
            if(empty($detail["data"]))
            {
                exit(json_encode(array(
                    "status"=>false,
                    "message"=>"该模块不存在"
                )));
            }
            else
            {
                $info=$detail["data"];
                $info["table"]=strtolower($info["module"]);
            }
        }
        else
        {
            $back=$this->db->error();
            $back["status"]=false;
            if(empty($back["message"]))
            {
                $back["message"]="参数错误";
            }
            exit(json_encode($back));
        }

        if(!$this->db->table_exists($this->table_pre.$info["table"]))
        {
            exit(json_encode(array(
                "status"=>false,
                "message"=>"该模块没有创建字段"
            )));
        }
        $re=array_key_exists("re",$data)?($data["re"]==="true"):true;
        if($re)
        {
            $c="models/base/".$info["table"]."_model/controller.json";
            $m="models/base/".$info["table"]."_model/model.json";
            if($this->file->has($c)||$this->file->has($m))
            {
                exit(json_encode(array(
                    "status"=>false,
                    "message"=>"模块生成失败"
                )));
            }
        }

        $table="models/base/".$info["table"]."_model/table.json";
        if($exists = $this->file->has($table))
        {
            $contents=$this->file->read($table);
            if(empty($contents))
            {
                exit(json_encode(array(
                    "status"=>false,
                    "message"=>"该模块没有创建字段"
                )));
            }
            else
            {
                $info["primary"]=json_decode(json_encode(json_decode($contents)),true)["primary"];
            }
        }
        else
        {
            exit(json_encode(array(
                "status"=>false,
                "message"=>"该模块没有创建字段"
            )));
        }

        $model=array();
        $controller=array();

        $model["name"]=$info["table"]."_model";
        $model["extends"]="Api_Model";
        $model["construct"]=array(
            "table_name"=>$info["table"],
            "primary"=>$info["primary"],
            "db_tablepre"=>$this->table_pre
        );
        $model_base="models/base/".$info["table"]."_model/";
        $this->file->put($model_base."model.json",json_encode($model));

//        protected $model_name;
//        public $model_suffix="_model";
//        protected $_model;
//        public $available;
        $controller["name"]=$info["table"];
        $controller["extends"]="Api_Controller";
        $controller["construct"]=array(
            "model_name"=>$info["table"],
            "model_suffix"=>"_model",
            "authox_start"=>false,
            "available"=>$info["available"]?true:false,
        );
        $this->file->put($model_base."controller.json",json_encode($controller));

        $this->load->helper("api");

        $this->file->put("models/".$info["table"]."_model.php",api($model));
        $this->file->put("controllers/api/".$info["table"].".php",api($controller));

        if(($this->file->has("models/".$info["table"]."_model.php"))
            &&($this->file->has("controllers/api/".$info["table"].".php")))
        {
            echo json_encode(array(
                "status"=>true,
                "message"=>"模块生成完毕",
                "href"=>ROOTURL."api/".$info["table"]."/page"
            ));
        }
    }

    /**
     * 修改ac_module中的信息
     * 已加入
     * 已测试
     */
    public function modify()
    {
        $data=json_decode(json_encode(json_decode($this->input->raw_input_stream)),true);

        if(!is_array($data))
        {
            exit(json_decode(array(
                "status"=>false,
                "message"=>"参数错误"
            )));
        }

        $input=array();
        $input["module_id"]=array_key_exists("module_id",$data)?$data["module_id"]:"";
        $input["module"]=array_key_exists("module",$data)?$data["module"]:"";
        $input["module_name"]=array_key_exists("module_name",$data)?$data["module_name"]:"";

        $input["modify_time"]=DATE_TIME;
        $input["modify_user"]=$this->session->userdata("user_name");

        if(empty($input['module_name'])||empty($input["module"])||empty($input["module"]))
        {
            exit(json_decode(array(
                "status"=>false,
                "message"=>"参数错误"
            )));
        }

        if($module=$this->_model->detail($input))
        {
            if(empty($module["data"]))
            {
                exit(json_decode(array(
                    "status"=>false,
                    "message"=>"该模块不存在"
                )));
            }
            else
            {
                $module=$module["data"];
            }
            if($module["module"]===$input["module"]&&$module["module_name"]===$input["module_name"])
            {
                exit(json_encode(array(
                    "status"=>true,
                    "message"=>"没有改变"
                )));
            }
            if($this->_model->modify($input))
            {
                if($this->db->table_exists(DB_TABLE_PRE.strtolower($module["module"])))
                {//修改表名
                    $this->dbforge->rename_table(DB_TABLE_PRE.strtolower($module["module"]),DB_TABLE_PRE.strtolower($input["module"]));
                }
                $old_model_base="models/base/".strtolower($module["module"])."_model";
                $old_model="models/".strtolower($module["module"])."_model.php";
                $old_controller="controllers/api/".strtolower($module["module"]).".php";
                $new_model_base="models/base/".strtolower($input["module"])."_model";
                $new_model="models/".strtolower($input["module"])."_model.php";
                $new_controller="controllers/api/".strtolower($input["module"]).".php";
                if($this->file->has($old_model_base))
                {//修改配置文件
                    $this->file->rename($old_model_base,$new_model_base);
                }
                if($this->file->has($old_controller))
                {//修改控制器
                    $this->file->rename($old_controller,$new_controller);
                }
                if($this->file->has($old_model))
                {
                    $this->load->helper("api");
                    $this->file->rename($old_model,$new_model);
                    if($this->file->has($new_model_base."/controller.json"))
                    {//修改控制器配置文件
                        $contents=$this->file->read($new_model_base."/controller.json");
                        $contents=json_decode($contents,true);
                        $contents["name"]=strtolower($input["module"]);
                        $contents["construct"]["model_name"]=strtolower($input["module"]);
                        $this->file->put($new_model_base."/controller.json",json_encode($contents));
                        //重新生成xxx_model.php
                        $this->file->put($new_controller,api($contents));
                    }
                    if($this->file->has($new_model_base."/model.json"))
                    {//修改模型配置文件
                        $contents=$this->file->read($new_model_base."/model.json");
                        $contents=json_decode($contents,true);
                        $contents["name"]=strtolower($input["module"])."_model";
                        $contents["construct"]["table_name"]=strtolower($input["module"]);
                        $this->file->put($new_model_base."/model.json",json_encode($contents));
                        //重新生成xxx.php
                        $this->file->put($new_model,api($contents));
                    }
                    $back=array(
                        "status"=>true,
                        "message"=>"修改成功"
                    );
                }
                else
                {
                    $back=array(
                        "status"=>true,
                        "message"=>"模块未生成"
                    );
                }
            }
            else
            {
                $back=$this->db->error();
                $back["status"]=false;
                if(empty($back["message"]))
                    $back["message"]="修改失败";
            }
        }
        else
        {
            $back=$this->db->error();
            $back["status"]=false;
            if(empty($back["message"]))
                $back["message"]="该模块不存在或参数错误";
        }

        echo json_encode($back);

    }

    /**
     * 修改api数据库表字段
     * 添加
     * $data=array("module_id"=>"","keys"=>array(),"field"=>array())
     * keys是存到table.json里的   field是用于添加数据库表字段的
     * 已添加
     * 已测试
     */
    public function add_field()
    {
        $data=json_decode(json_encode(json_decode($this->input->raw_input_stream)),true);

        if(!is_array($data))
        {
            exit(json_decode(array(
                "status"=>false,
                "message"=>"参数错误"
            )));
        }

        $input["module_id"]=array_key_exists("module_id",$data)?$data["module_id"]:"";
        $input["field"]=array_key_exists("field",$data)?$data["field"]:array();
        $input["keys"]=array_key_exists("keys",$data)?$data["keys"]:array();

        if(empty($input['module_id'])||empty($input["field"])||empty($input["keys"]))
        {
            exit(json_decode(array(
                "status"=>false,
                "message"=>"参数错误"
            )));
        }

        if($module=$this->_model->detail($input))
        {
            if(empty($module["data"]))
            {
                exit(json_decode(array(
                    "status"=>false,
                    "message"=>"该模块不存在"
                )));
            }
            else
            {
                $module=$module["data"];

                $this->_model->modify(array(
                    "module_id"=>$input["module_id"],
                    "modify_time"=>DATE_TIME,
                    "modify_user"=>$this->session->userdata("user_name")
                ));
            }

            $model_base="models/base/".strtolower($module["module"])."_model/";
            if($this->file->has($model_base."table.json"))
            {
                $table=$this->file->read($model_base."table.json");
                $table=json_decode($table,true);
                $field=array_keys($input["field"])[0];
                if($field!==$input["keys"]["key"])
                {
                    exit(json_encode(array(
                       "status"=>false,
                        "message"=>"参数错误"
                    )));
                }
                if(@$table["primary"]==$field)
                {
                    exit(json_encode(array(
                        "status"=>false,
                        "message"=>"不可以与主键同名"
                    )));
                }
                else
                {
                    $table_keys=array_keys($table["keys"]);

                    if(in_array($field,$table_keys,true)
                        ||$this->db->field_exists($field,DB_TABLE_PRE.strtolower($module["module"])))
                    {
                        exit(json_encode(array(
                            "status"=>false,
                            "message"=>"该字段已存在"
                        )));
                    }
                    else
                    {
                        $this->dbforge->add_column(DB_TABLE_PRE.strtolower($module["module"]),$input["field"]);
                        $table["keys"][$input["keys"]["key"]]=$input["keys"];
                        $this->file->put($model_base."table.json",json_encode($table));
                        $table_keys=array_keys($table["keys"]);
                        $this->file->put($model_base."entity.json",json_encode($table_keys));
                        $table_name=array();
                        foreach ($table_keys as $v)
                        {
                            @$table_name[$v]=$table["keys"][$v]["key_name"];
                        }
                        $this->file->put($model_base."name.json",json_encode($table_name));

                        $sql="Describe ".DB_TABLE_PRE.strtolower($module["module"])." ".$field;

                        $fd=$this->db->query($sql);
                        if(count($fd->result_array())==1)
                        {
                            $back=array(
                                "status"=>true,
                                "message"=>"添加成功"
                            );
                        }
                        else
                        {
                            $back=array(
                                "status"=>false,
                                "message"=>"添加失败"
                            );
                        }
                    }
                }
            }
            else
            {
                exit(json_encode(array(
                    "status"=>false,
                    "message"=>"读取表配置文件错误"
                )));
            }
        }
        else
        {
            $back=$this->db->error();
            $back["status"]=false;
            if(empty($back["message"]))
                $back["message"]="该模块不存在或参数错误";
        }

        echo json_encode($back);
    }

    /**
     * 删除字段
     * 已添加
     * 已测试
     */
    public function delete_field()
    {
        $data=json_decode(json_encode(json_decode($this->input->raw_input_stream)),true);

        if(!is_array($data))
        {
            exit(json_decode(array(
                "status"=>false,
                "message"=>"参数错误"
            )));
        }
        $input["module_id"]=array_key_exists("module_id",$data)?$data["module_id"]:"";
        $input["key"]=array_key_exists("key",$data)?$data["key"]:"";

        if(empty($input["module_id"])||empty($input["key"]))
        {
            exit(json_encode(array(
                "status"=>false,
                "message"=>"参数错误"
            )));
        }

        if($module=$this->_model->detail($input))
        {
            if(empty($module["data"]))
            {
                exit(json_decode(array(
                    "status"=>false,
                    "message"=>"该模块不存在"
                )));
            }
            else
            {
                $module=$module["data"];
                $this->_model->modify(array(
                    "module_id"=>$input["module_id"],
                    "modify_time"=>DATE_TIME,
                    "modify_user"=>$this->session->userdata("user_name")
                ));
            }

            $model_base="models/base/".strtolower($module["module"])."_model/";
            if($this->file->has($model_base."table.json"))
            {
                $contents=$this->file->read($model_base."table.json");
                $contents=json_decode($contents,true);

                $this->load->helper("array");
                if(!array_key_exists($input["key"],$contents["keys"]))
                {
                    exit(json_encode(array(
                       "status"=>false,
                        "message"=>"该字段不存在"
                    )));
                }
                if($input["key"]===$contents["primary"])
                {
                    exit(json_encode(array(
                       "status"=>false,
                        "message"=>"主键不可删除"
                    )));
                }

                array_remove_void($contents["keys"],$input["key"]);
                $this->file->put($model_base."table.json",json_encode($contents));

                $entity=array_keys($contents['keys']);
                $this->file->put($model_base."entity.json",json_encode($entity));

                $name=array();
                foreach ($entity as $v)
                {
                    $name[$v]=$contents["keys"][$v]["key_name"];
                }
                $this->file->put($model_base."name.json",json_encode($name));

                if($this->db->field_exists($input["key"],DB_TABLE_PRE.strtolower($module["module"])))
                {
                    $this->dbforge->drop_column(DB_TABLE_PRE.strtolower($module["module"]),$input["key"]);
                }

                $sql="Describe ".DB_TABLE_PRE.strtolower($module["module"])." ".$input["key"];

                $fd=$this->db->query($sql);
                if(count($fd->result_array())!=1)
                {
                    $back=array(
                        "status"=>true,
                        "message"=>"删除成功"
                    );
                }
                else
                {
                    $back=array(
                        "status"=>false,
                        "message"=>"删除失败"
                    );
                }
            }
            else
            {
                exit(json_encode(array(
                    "status"=>false,
                    "message"=>"字段配置文件不存在"
                )));
            }
        }
        else
        {
            $back=$this->db->error();
            $back["status"]=false;
            if(empty($back["message"]))
                $back["message"]="该模块不存在或参数错误";
        }

        echo json_encode($back);
    }

    /**
     * 修改字段
     * $data=[
     *      module_id: module_id,
     *      base:"",   //保存源字段名  用作比较是否重命名
     *      keys: [],  //保存到table.json中的数据
     *      field: {}  //用与修改数据库表中的字段的数据
     * ]
     * 已添加
     * 未测试
     */
    public function modify_field()
    {
        $data=json_decode(json_encode(json_decode($this->input->raw_input_stream)),true);

        if(!is_array($data))
        {
            exit(json_decode(array(
                "status"=>false,
                "message"=>"参数错误"
            )));
        }

        $input["module_id"]=array_key_exists("module_id",$data)?$data["module_id"]:"";
        $input["base"]=array_key_exists("base",$data)?$data["base"]:"";
        $input["keys"]=array_key_exists("keys",$data)?$data["keys"]:"";
        $input["field"]=array_key_exists("field",$data)?$data["field"]:"";

        if(empty($input["module_id"])||empty($input["base"])||empty($input["keys"])||empty($input["field"]))
        {
            exit(json_encode(array(
                "status"=>false,
                "message"=>"参数错误"
            )));
        }

        if(array_keys($input["field"])[0]!==$input["base"])
        {
            exit(json_encode(array(
                "status"=>false,
                "message"=>"参数错误"
            )));
        }

        if($module=$this->_model->detail($input))
        {
            if (empty($module["data"]))
            {
                exit(json_decode(array(
                    "status" => false,
                    "message" => "该模块不存在"
                )));
            }
            else
            {
                $module = $module["data"];
                $this->_model->modify(array(
                    "module_id" => $input["module_id"],
                    "modify_time" => DATE_TIME,
                    "modify_user" => $this->session->userdata("user_name")
                ));
            }
            $this->load->helper("array");
            $model_base="models/base/".strtolower($module["module"])."_model/";
            if($this->file->has($model_base."table.json"))
            {
                $table=$this->file->read($model_base."table.json");
                $table=json_decode($table,true);
                $table_keys=array_keys($table["keys"]);
                if($input["base"]===$input['keys']["key"])
                {//字段没有重命名
                    if(in_array($input["base"],$table_keys,true))
                    {
                        if($input["base"]===$table["primary"])
                        {
                            exit(json_encode(array(
                                "status"=>false,
                                "message"=>"主键不能修改"
                            )));
                        }

                        $table["keys"][$input["base"]]=$input["keys"];
                        $this->file->put($model_base."table.json",json_encode($table));
                        if($this->db->field_exists($input["base"],DB_TABLE_PRE.strtolower($module["module"])))
                        {
                            $this->dbforge->modify_column(DB_TABLE_PRE.strtolower($module["module"]),$input['field']);
                        }
                        $back=array(
                            "status"=>true,
                            "message"=>"修改成功"
                        );
                    }
                    else
                    {
                        exit(json_encode(array(
                            "status"=>false,
                            "message"=>"修改的字段不存在"
                        )));
                    }
                }
                else
                {//字段重命名
                    if($input["keys"]["key"]===$table['primary'])
                    {
                        exit(json_encode(array(
                           "status"=>false,
                            "message"=>"不可以和主键同名"
                        )));
                    }
                    if(in_array($input['keys']['key'],$table_keys,true))
                    {
                        exit(json_encode(array(
                            "status"=>false,
                            "message"=>"不可以和已有字段同名"
                        )));
                    }
                    $table["keys"][$input["keys"]["key"]]=$input["keys"];
                    array_remove_void($table["keys"],$input["base"]);
                    $this->file->put($model_base."table.json",json_encode($table));
                    if($this->db->field_exists($input["base"],DB_TABLE_PRE.strtolower($module["module"])))
                    {
                        $this->dbforge->modify_column(DB_TABLE_PRE.strtolower($module["module"]),$input['field']);
                    }
                    $back=array(
                        "status"=>true,
                        "message"=>"修改成功"
                    );
                }
            }
            else
            {
                exit(json_encode(array(
                    "status"=>false,
                    "message"=>"字段配置文件不存在"
                )));
            }
        }
        else
        {
            $back=$this->db->error();
            $back["status"]=false;
            if(empty($back["message"]))
                $back["message"]="该模块不存在或参数错误";
        }

        echo json_encode($back);
    }

    /**
     * 生成数据源管理的添加数据form页面
     * 未加入
     * 未完成
     * module/api_form/:ctrl/:module_id/:item_id
     * 第三段是表单动作 apiAdd或apiModify 同时也是angularjs的控制器
     * 第四段是module_id是在ac_module表中的ID
     * 第五段是item_id是表中所需要编辑的数据行的ID 在apiModify时才有意义
     */
    public function api_form()
    {
$temp=<<<html
<div class="row">
    <div class="col-xs-12" style="min-height: 500px;">
        <p>模块不存在或参数错误</p>
    </div>
</div>
html;
$error=<<<html
<div class="row"> 
    <div class="col-xs-12" style="min-height: 500px;">
        <p>该模块缺少配置文件</p>
    </div>
</div>
html;

        $ctrl=$this->uri->segment(3);

        if(empty($ctrl))
        {
            exit($temp);
        }

        if($ctrl=="apiAdd")
        {
            $this->_form_add($temp,$error);
        }
        else if($ctrl=="apiModify")
        {
            $this->_form_modify($temp,$error);
        }
        else
        {
            exit($temp);
        }

        //TODO:未完成
    }

    private function _form_add($temp,$error)
    {
        $module_id=$this->uri->segment(4);
        if(empty($module_id))
        {
            exit($temp);
        }
        if($module=$this->_model->detail(array("module_id"=>$module_id)))
        {
            if (empty($module["data"]))
            {
                exit($temp);
            }
            else
            {
                $module = $module["data"];
            }
            $model_base="models/base/".strtolower($module["module"])."_model/";
            $model="models/".strtolower($module["module"])."_model.php";
            $controller="controllers/api/".strtolower($module["module"]).".php";

            if($this->file->has($model_base."name.json")
                &&$this->file->has($model_base."entity.json")
                &&$this->file->has($model_base."table.json")
                &&$this->file->has($model)
                &&$this->file->has($controller)
                &&$this->db->table_exists(DB_TABLE_PRE.strtolower($module["module"]))
            )
            {
                $name=$this->file->read($model_base."name.json");
                $name=json_decode($name,true);
                $table=$this->file->read($model_base."table.json");
                $table=json_decode($table,true);

                $data=array(
                    "module"=>$module,
                    "name"=>$name,
                    "table"=>$table,
                    "controller"=>"apiAdd",
                    "form_title"=>$module["module_name"]."模块 ".$module["module"]."表 数据添加"
                );

                $this->load->view("api/form.php",$data);
            }
            else
            {
                exit($error);
            }
        }
        else
        {
            exit($temp);
        }
    }

    private function _form_modify($temp,$error)
    {
        $module_id=$this->uri->segment(4);
        $item_id=$this->uri->segment(5);
    }


    /**
     * 模块数据源管理
     * 根据搜索框左侧的下拉框确定搜索的字段是哪个
     * 已加入
     * 已测试
     * 完成部分
     */
    public function api()
    {
$temp=<<<html
<div class="row">
    <div class="col-xs-12" style="min-height: 500px;">
        <p>不存在该模块或参数错误</p>
    </div>
</div>
html;
$lose=<<<html
<div class="row">
    <div class="col-xs-12" style="min-height: 500px;">
        <p>模块没有完全生成，缺少文件</p>
    </div>
</div>
html;
        $module_id=$this->uri->segment(3);
        if(empty($module_id))
        {
            exit($temp);
        }
        if($module=$this->_model->detail(array("module_id"=>$module_id)))
        {
            if (empty($module["data"]))
            {
                exit($temp);
            }
            else
            {
                $module = $module["data"];
            }
            $model_base="models/base/".strtolower($module["module"])."_model/";
            $model="models/".strtolower($module["module"])."_model.php";
            $controller="controllers/api/".strtolower($module["module"]).".php";

            if($this->file->has($model_base."name.json")
                &&$this->file->has($model_base."entity.json")
                &&$this->file->has($model_base."table.json")
                &&$this->file->has($model)
                &&$this->file->has($controller)
                &&$this->db->table_exists(DB_TABLE_PRE.strtolower($module["module"]))
            )
            {
                $name=$this->file->read($model_base."name.json");
                $name=json_decode($name,true);
                $table=$this->file->read($model_base."table.json");
                $table=json_decode($table,true);

                $data=array(
                    "module"=>$module,
                    "name"=>$name,
                    "table"=>$table
                );

                $this->load->view("api/index.php",$data);
            }
            else
            {
                exit($lose);
            }
        }
        else
        {
            exit($temp);
        }
    }

    public function api_upload()
    {

    }

}
