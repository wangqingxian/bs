<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2017/2/10
 * Time: 10:44
 */
class Authox extends Api_Controller
{
    public function __construct()
    {
        $this->model_name="authox";
        $this->authox_start=true;
        $this->available=true;
        parent::__construct();
    }

    /**
     * 修改用户除 用户组赋予的权限以外的权限
     * 已添加
     * 已测试
     */
    public function update()
    {
        $data=json_decode($this->input->raw_input_stream);
        $data=json_decode(json_encode($data),true);
        if(!is_array($data))
        {
            exit(json_encode(array(
                    "status"=>false,
                    "message"=>"参数错误！"
                )
            )
            );
        }

        if($this->_model->add_authox($data))
        {
            $back=array(
                "status"=>true,
                "message"=>"权限修改成功"
            );
        }
        else
        {
            $back=$this->db->error();
            if(empty($back["message"]))
            {
                $back["message"]="参数错误！";
            }
        }

        echo json_encode($back);
    }

    /**
     * 获取用户拥有的额外权限
     * 已添加
     * 已测试
     */
    public function haved()
    {
        $input=$this->_input("haved",true);
        if($back=$this->_model->page($input,false))
        {

        }
        else
        {
            $back=$this->db->error();
            $back["status"]=false;
        }

        echo json_encode($back);
    }

}