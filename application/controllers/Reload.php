<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2017/2/16
 * Time: 11:41
 */
class Reload extends Authox_Controller
{

    public function __construct()
    {
        $this->authox_start=false;
        parent::__construct();
    }

    /**
     * 权限重载
     */
    function index()
    {
        $this->load->model("user_model");
        $user_id=$this->session->userdata("user_id");
        if($this->session->userdata("is_login")=="yes")
        {
            $r = $this->User_model->get_one(array(
                    'user_id'=>$user_id
                )
            );
            if(!$r)
            {
                exit( json_encode(array(
                        'status'=>false,
                        'message'=>'账户已被删除'
                    )
                ));
            }
            else if($r['is_lock'])
            {
                exit( json_encode(array(
                        'status'=>false,
                        'message'=>' 帐号已被锁定'
                    )
                ));
            }
            else
            {
                if($this->User_model->authox($r['user_id']))
                {
                    exit( json_encode(array(
                            "status"=>true,
                            "message"=>"权限重载成功"
                        )
                    ));
                }
                else
                {
                    exit( json_encode(array(
                            "status"=>false,
                            "message"=>"权限重载失败"
                        )
                    ));
                }
            }
        }
        else
        {
            if($this->input->is_ajax_request())
            {
                exit( json_encode(array(
                        "status"=>false,
                        "message"=>"登录超时"
                    )
                ));
            }
            else
            {
                redirect("login");
            }
        }
    }
}