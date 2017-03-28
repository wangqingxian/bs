<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2017/3/9
 * Time: 9:03
 */
use League\Flysystem\Filesystem;
use League\Flysystem\Adapter\Local;

class Template extends Authox_Controller
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

    /**
     * 添加模版
     * 未添加
     * 未测试
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
        $template=array();
        $template["name"]=array_key_exists("name",$data)?strtolower($data["name"]):"";

        if(empty($template["name"]))
        {
            exit(json_encode(array(
                "status"=>false,
                "message"=>"参数错误"
            )));

        }

        if(!$this->file->has($template["name"].".html"))
        {
            $this->file->put($template["name"].".html","");
            $this->file->put($template["name"].".json","[]");
            $this->file->put($template["name"].".js","");
            $back=array(
                "status"=>true,
                "message"=>"添加成功"
            );
        }
        else
        {
            $back=array(
                "status"=>false,
                "message"=>"模版已经存在"
            );
        }

        echo json_encode($back);
    }

    /**
     * 删除模版
     * 未添加
     * 未测试
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
        $delete["basename"]=array_key_exists("basename",$data)?strtolower($data["basename"]):"";

        if(empty($delete["basename"]))
        {
            exit(json_encode(array(
                "status"=>false,
                "message"=>"参数错误"
            )));
        }

        if($this->file->has($delete["basename"]))
            $this->file->delete($delete["basename"]);

        $base_name=explode(".",$delete["basename"])[0];

        if($this->file->has($base_name.".json"))
            $this->file->delete($base_name.".json");

        if($this->file->has($base_name.".js"))
            $this->file->delete($base_name.".js");

        $back=array(
            "status"=>true,
            "message"=>"删除成功"
        );

        echo json_encode($back);
    }

    /**
     * 模版重命名
     * 未添加
     * 未测试
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
        $modify["filename"]=array_key_exists("filename",$data)?strtolower($data["filename"]):"";

        $modify["new"]=array_key_exists("new",$data)?$data["new"]:"";

        if(empty($modify["filename"])||empty($modify["new"]))
        {
            exit(json_encode(array(
                "status"=>false,
                "message"=>"参数错误"
            )));
        }

        $flag=true;
        if((!$this->file->has($modify["new"].".html")&&$this->file->has($modify["filename"].".html"))
            &&(!$this->file->has($modify["new"].".json")&&$this->file->has($modify["filename"].".json"))
            &&(!$this->file->has($modify["new"].".js")&&$this->file->has($modify["filename"].".js"))
        )
        {
            $content=$this->file->read($modify['filename'].".html");
            @str_replace("<script src='user/".$modify["filename"].".js'></script>",
                        "<script src='user/".$modify["new"].".js'></script>",
                        $content);
            $this->file->put($modify['filename'],$content);
            $this->file->rename($modify["filename"].".html",$modify["new"].".html");
            $this->file->rename($modify["filename"].".json",$modify["new"].".json");
            $this->file->rename($modify["filename"].".js",$modify["new"].".js");
        }
        else
            $flag=false;

        if($flag)
        {
            $back=array(
                "status"=>true,
                "message"=>"修改成功"
            );
        }
        else
        {
            $back=array(
                "status"=>false,
                "message"=>"文件不存在或重名"
            );
        }
        echo json_encode($back);
    }

    /**
     * 获取所有模版列表
     * 未添加
     * 未测试
     */
    public function all()
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

}