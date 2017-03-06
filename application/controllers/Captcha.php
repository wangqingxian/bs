<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2017/2/16
 * Time: 16:09
 */
class Captcha extends CI_Controller
{
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * 生成验证码
     * 无需权限控制
     * 已测试
     */
    function index()
    {
        $this->load->model("captcha_model");
        if($img=$this->captcha_model->create())
        {
            $back=array(
                "status"=>true,
                "message"=>"验证码生成成功",
                "data"=>$img
            );
        }
        else
        {
            $back=$this->db->error();
            $back["status"]=false;
            if(empty($back["message"]))
            {
                $back["message"]="验证码生成失败";
            }
        }

        echo json_encode($back);
    }
}