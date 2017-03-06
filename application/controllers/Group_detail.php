<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2017/2/14
 * Time: 17:09
 */
class Group_detail extends Api_Controller
{
    public function __construct()
    {
        $this->model_name="group_detail";
        $this->authox_start=true;
        $this->available=true;
        parent::__construct();
    }

    /**
     * 对够一个用户分组所用有的权限进行修改
     * 已加入
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

        if($this->_model->add_detail($data))
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
     * 获取摸个用户分组所用后的权限
     * 已加入
     * 已修改
     */
    public function haved()
    {
        $input=$this->_input("",true);
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