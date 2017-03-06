<?php

class User extends Authox_Controller
{
    public function __construct()
    {
        $this->authox_start=true;
        parent::__construct();
        $this->load->model("user_model");
    }

    //TODO： 优化 添加超级用户 直接定义在constants.php中 安装化初始化
    //添加 不能于超级用户同名 超级用户默认拥有所有权限
    /**
     * 锁定用户
     * 已加入
     * 未测试
     */
    function lock()
    {
        $data=json_decode($this->input->raw_input_stream);
        $data=json_decode(json_encode($data),true);
        if(!is_array($data))
        {
            $data=array();
        }

        if(array_key_exists("user_id",$data)&&array_key_exists("is_lock",$data))
        {
            if($data["user_id"]==$this->session->userdata("user_id"))
            {
                exit(json_encode(array(
                    "status"=>false,
                    "message"=>"自己不能锁定自己"
                )));
            }
            if($this->user_model->modify(array("user_id"=>$data["user_id"],"is_lock"=>$data["is_lock"])))
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
            }

            echo json_encode($back);
        }
        else
        {
            exit(json_encode(array(
                "status"=>false,
                "message"=>"参数错误"
            )));
        }
    }

    /**
     * 用户快速注册
     * 已添加
     * 已测试
     */
    function register()
    {
        $data=json_decode($this->input->raw_input_stream);
        $data=json_decode(json_encode($data),true);
        if(!is_array($data))
        {
            $data=array();
        }
        if(!(array_key_exists("username",$data)&&array_key_exists("password",$data)&&array_key_exists("encrypt",$data)))
        {
            exit(json_encode(array(
                "status"=>false,
                "message"=>"参数错误"
            )));
        }
        $this->load->model("captcha_model");
        if(!$this->captcha_model->check($data["encrypt"],$this->input->ip_address(),time()-7200))
        {
            exit(json_encode(array(
                "status"=>false,
                "message"=>"验证码错误"
            )));
        }
        if($this->user_model->check_username_exists($data["username"]))
        {
            exit(json_encode(array(
                "status"=>false,
                "message"=>"该帐号已存在"
            )));
        }
        $fullname=array_key_exists("fullname",$data)?$data["fullname"]:"";
        $group_id=array_key_exists("group_id",$data)?$data["group_id"]:"";
        if($this->user_model->quick_register($data["username"],$data["password"],$data["encrypt"],$fullname,$group_id))
        {
            $back=array(
                "status"=>true,
                "message"=>"添加成功"
            );
        }
        else
        {
            $back=$this->db->error();
            $back["status"]=false;
            if($back["message"]=="")
            {
                $back["message"]="参数错误!";
            }
        }

        echo json_encode($back);
    }

    /**
     * 分页展示用户
     * 已添加
     * 已测试
     */
    function page()
    {
        $data=json_decode($this->input->raw_input_stream);
        $data=json_decode(json_encode($data),true);
        if(!is_array($data))
        {
            $data=array();
        }

        if($back=$this->user_model->page($data,true))
        {

        }
        else
        {
            $back=$this->db->error();
            $back["status"]=false;
            if($back["message"]=="")
            {
                $back["message"]="参数错误!";
            }
        }

        echo json_encode($back);
    }

    /**
     * 获取用户详情
     * 已添加
     * 已测试
     */
    function detail()
    {
        $data=json_decode($this->input->raw_input_stream);
        $data=json_decode(json_encode($data),true);
        if(!is_array($data))
        {
            $data=array();
        }
        if(array_key_exists("user_id",$data))
        {
            if(empty($data["user_id"]))
                $data["user_id"]=$this->session->userdata("user_id");
        }
        else
        {
            $data["user_id"]=$this->session->userdata("user_id");
        }
        $data["select"]=array(
            "user_id",
            "username",
            "fullname",
            "email",
            "qq",
            "weixin",
            "mobile"
        );
        if($back=$this->user_model->detail($data))
        {

        }
        else
        {
            $back=$this->db->error();
            $back["status"]=false;
            if($back["message"]=="")
            {
                $back["message"]="参数错误!";
            }
        }

        echo json_encode($back);
    }

    /**
     * 用户更换分组
     * 无法通过modify接口修改 只能通过gchange接口修改
     * 已添加
     * 已修改
     */
    function gchange()
    {
        $data=json_decode($this->input->raw_input_stream);
        $data=json_decode(json_encode($data),true);
        if(!is_array($data))
        {
            $data=array();
        }
        if(!(array_key_exists("group_id",$data)&&array_key_exists("user_id",$data)))
        {
            exit(json_encode(array(
                "status"=>false,
                "message"=>"参数错误"
            )));
        }
        if($this->user_model->modify(array("user_id"=>$data["user_id"],"group_id"=>$data["group_id"])))
        {
            $back=array(
                "code"=>200,
                "status"=>true,
                "message"=>"修改成功"
            );
        }
        else
        {
            $back=$this->db->error();
            $back["status"]=false;
            if($back["message"]=="")
            {
                $back["message"]="参数错误!";
            }
        }

        echo json_encode($back);
    }

    /**
     * 修改密码
     * 无法通过modify接口修改 只能通过paschange接口修改
     * 已添加
     * 已测试
     */
    function paschange()
    {
        $data=json_decode($this->input->raw_input_stream);
        $data=json_decode(json_encode($data),true);
        if(!is_array($data))
        {
            $data=array();
        }
        if(!(array_key_exists("oldpassword",$data)&&array_key_exists("password",$data)&&array_key_exists("user_id",$data)&&array_key_exists("encrypt",$data)))
        {
            exit(json_encode(array(
                "status"=>false,
                "message"=>"参数错误"
            )));
        }
        $this->load->model("captcha_model");
        if(!$this->captcha_model->check($data["encrypt"],$this->input->ip_address(),time()-7200))
        {
            exit(json_encode(array(
                "status"=>false,
                "message"=>"验证码错误"
            )));
        }
        $r = $this->user_model->get_one(array(
                'user_id'=>$data['user_id']
            )
        );
        $password = md5(md5(trim($data['oldpassword']).$r['encrypt']));
        if($r['password'] != $password)
        {
            exit(json_encode(array(
                "status"=>false,
                "message"=>"原密码错误"
            )));
        }
        if($this->user_model->quick_changpwd($data["user_id"],$data["password"],$data["encrypt"]))
        {
            $back=array(
                "code"=>200,
                "status"=>true,
                "message"=>"修改成功"
            );
        }
        else
        {
            $back=$this->db->error();
            $back["status"]=false;
            if($back["message"]=="")
            {
                $back["message"]="参数错误!";
            }
        }

        echo json_encode($back);
    }

    /**
     * 修改用户详情
     * 无法修改分组和密码
     * 已添加
     * 已修改
     */
    function modify()
    {
        $data=json_decode($this->input->raw_input_stream);
        $data=json_decode(json_encode($data),true);
        if(!is_array($data))
        {
            $data=array();
        }
        $this->load->helper("array");
        $data=array_remove($data,"group_id");
        $data=array_remove($data,"username");
        if($this->user_model->modify($data))
        {
            $back=array(
                "code"=>200,
                "status"=>true,
                "message"=>"修改成功"
            );
        }
        else
        {
            $back=$this->db->error();
            $back["status"]=false;
            if($back["message"]=="")
            {
                $back["message"]="参数错误!";
            }
        }

        echo json_encode($back);
    }

    /**
     * 删除用户
     * 可批量删除
     * 已添加
     * 已测试
     */
    function delete()
    {
        $data=json_decode($this->input->raw_input_stream);
        $data=json_decode(json_encode($data),true);
        if(!is_array($data))
        {
            $data=array();
        }

        if($this->user_model->deletes($data))
        {
           $back=array(
               "status"=>true,
               "message"=>"删除成功"
           );
        }
        else
        {
            $back=$this->db->error();
            $back["status"]=false;
            if($back["message"]=="")
            {
                $back["message"]="参数错误!";
            }
        }

        echo json_encode($back);
    }

    /**
     * 添加用户
     * 已添加
     * 已测试
     */
    function add()
    {
        //encrypt 加密字段=验证码
        $data=json_decode($this->input->raw_input_stream);
        $data=json_decode(json_encode($data),true);
        if(!is_array($data))
        {
            $data=array();
        }

        if($this->user_model->add($data))
        {
            $back=array(
                "status"=>true,
                "message"=>"添加成功"
            );
        }
        else
        {
            $back=$this->db->error();
            $back["status"]=false;
            if($back["message"]=="")
            {
                $back["message"]="参数错误!";
            }
        }

        echo json_encode($back);
    }
}
