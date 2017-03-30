<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2017/3/9
 * Time: 9:10
 */
use League\Flysystem\Filesystem;
use League\Flysystem\Adapter\Local;
/**
 * Class Html
 * 可视化编辑的视图控制器
 */
class Html extends Authox_Controller
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

    private function _json($json)
    {
        if($this->file->has($json))
        {
            $c=$this->file->read($json);
            return array(
                "status"=>true,
                "data"=>$c
            );
        }
        else
        {
            return array(
                "status"=>false,
                "message"=>"参数错误或者配置不存在"
            );
        }
    }

    private function _html($html)
    {
        if($html===false)
        {
            return json_encode(array(
                "status"=>false,
                "message"=>"参数错误"
            ));
        }
        if($this->file->has($html))
        {
            $temp=$this->file->read($html);

            $preg = "/<script[\s\S]*?<\/script>/i";
            $preg2 = "/<iframe[\s\S]*?<\/iframe>/i";

            $temp = preg_replace($preg,"",$temp,-1);
            $safe = preg_replace($preg2,"",$temp,-1);
            return array(
                "status"=>true,
                "data"=>$safe
            );
        }
        else
        {
            return array(
                "status"=>false,
                "message"=>"参数错误或文件不存在"
            );
        }


    }

    function edit()
    {
        $html=$this->uri->segment(3,false);
        $data["ac_tittle"]="可视化编辑";
        $data["ac_page"]="html_edit";
        $back=$this->_html($html);
        if($back["status"])
        {
            $data["html"]=$back["data"];
            $json=explode(".",$html)[0].".json";
            $back=$this->_json($json);
            if($back["status"])
            {
                if(empty($back["data"]))
                {
                    $data["json"]="{}";
                }
                else
                {
                    $data["json"]=$back["data"];
                }

            }
            $data['file']=$html;
        }
        else
        {
            show_error($back["message"],404,"-_-");
            die();
        }
        $this->load->view("template/edit_head.php",$data);
        $this->load->view("edit/index.php",$data);
        $this->load->view("template/foot");
    }

    function get()
    {
        $html=$this->uri->segment(3,false);
        $temp=$this->_html($html);
        if($temp["status"])
        {
            echo "<html><body id='container'>";
            echo $temp["data"];
            echo "</body></html>";
        }
        else
        {
            echo $temp["message"];
        }

    }

    /**
     * 传的代码没有最外层容器
     * <div class="container"></div>
     * 最外层容器由welcome/index.php视图提供
     * $input={
     *     file：保存编辑的文件
     *     html：保存模版
     *     js：保存js配置
     * }
     * 半成品
     */
    function save()
    {
        $data=json_decode($this->input->raw_input_stream);
        $data=json_decode(json_encode($data),true);

        $temp=array_key_exists("html",$data)?$data['html']:"";
        $file=array_key_exists("file",$data)?$data["file"]:"";
        $json=array_key_exists("json",$data)?$data["json"]:"";
        if(empty($temp)&&empty($file)&&!$this->file->has($file))
        {
            exit(json_encode(array(
                "status"=>false,
                "message"=>"参数错误"
            )));
        }
        $preg = "/<script[\s\S]*?<\/script>/i";
        $preg2 = "/<iframe[\s\S]*?<\/iframe>/i";

        $temp = preg_replace($preg,"",$temp,-1);
        $safe = preg_replace($preg2,"",$temp,-1);

        $sn=substr($file,0,-5);

        $this->file->put($file,$safe);
        if(empty($json))
        {
            $json="{}";
        }
        $this->file->put($sn.".json",$json);
        $this->_re();
        echo json_encode(array(
            "status"=>true,
            "message"=>"保存成功"
        ));
    }

    private function _re()
    {
        //TODO: 初始化或生成js文件
    }

}