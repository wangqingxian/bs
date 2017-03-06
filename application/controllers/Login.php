<?php

class Login extends CI_Controller
{
    /**
     * 登录页面
     */
    function index()
    {
        $data["ac_tittle"]="登录";
        $data["ac_page"]="login";
        $this->load->view("template/head",$data);
        $this->load->view("login/index");
        $this->load->view("template/foot");
    }

    /**
     * 登录验证
     */
    function check()
    {
        $post = $this->input->post(array("username","password"));
        $an= json_decode(json_encode(json_decode($this->input->raw_input_stream)),true);
        $data=array(
            "username"=>"",
            "password"=>""
        );
        $data["username"]=array_key_exists("username",$an)?$an["username"]:$post["username"];
        $data["password"]=array_key_exists("password",$an)?$an["password"]:$post["password"];

        if($data['username']=="")
        {
            exit(json_encode(array(
                        'status'=>false,
                        'message'=>' 用户名不能为空'
                    )
                )
            );
        }
        else
        {
            $data['username']=trim($data['username']);
        }

        $this->load->model('Times_model');
        //密码错误剩余重试次数
        $rtime = $this->Times_model->get_one(array(
                                            'username'=>$data['username'],
                                            'is_admin'=>1,
                                            "login_time >= "=>SYS_TIME-7200
                                        )
                                    );
        $maxloginfailedtimes = 5;
        $ip = $this->input->ip_address();

        if($rtime)
        {
            if($rtime['failure_times'] > $maxloginfailedtimes)
            {
                $minute = 60-floor((SYS_TIME-$rtime['login_time'])/60);
                if($minute)
                exit(json_encode(array(
                            'status'=>false,
                            'message'=>' 密码尝试次数过多，被锁定'.$minute."分钟"
                        )
                    )
                );
            }
        }

        //登录认证
        //帐号验证
        $r = $this->User_model->get_one(array(
                                        'username'=>$data['username']
                                    )
                                );
        if(!$r)
        {
            exit(json_encode(array(
                        'status'=>false,
                        'message'=>' 用户名或密码不正确'
                    )
                )
            );
        }
        //密码验证
        $password = md5(md5(trim($data['password']).$r['encrypt']));
//        $password=$data['password'];

        if($r['password'] != $password)
        {
            if($rtime && $rtime['failure_times'] <= $maxloginfailedtimes)
            {
                $times = $maxloginfailedtimes-intval($rtime['failure_times']);
                $this->Times_model->update(array(
                                            'login_ip'=>$ip,
                                            'is_admin'=>1,
                                            'failure_times'=>'+=1'
                                        ),
                                        array(
                                            'username'=>$data['username']
                                        )
                                    );
            }
            else
            {
                $this->Times_model->delete(array(
                                                'username'=>$data['username'],
                                                'is_admin'=>1
                                            )
                                        );
                $this->Times_model->insert(array(
                                                'username'=>$data['username'],
                                                'login_ip'=>$ip,
                                                'is_admin'=>1,
                                                'login_time'=>SYS_TIME,
                                                'failure_times'=>1
                                            )
                                        );
                $times = $maxloginfailedtimes;
            }
            if($times==0)
            {
                exit(json_encode(array(
                        'status'=>false,
                        'message'=>' 密码尝试次数过多，被锁定60分钟'
                    )
                )
                );
            }
            else
            {
                exit(json_encode(array(
                            'status'=>false,
                            'message'=>' 密码错误您还有'.$times.'机会'
                        )
                    )
                );
            }
        }
        else
        {
            $this->Times_model->delete(array('username'=>$data['username']));
            if($r['is_lock'])
            {
                exit(json_encode(array(
                            'status'=>false,
                            'message'=>' 您的帐号已被锁定，暂时无法登录'
                        )
                    )
                );
            }
            $this->User_model->update(array(
                                            'last_login_ip'=>$ip,
                                            'last_login_time'=>date('Y-m-d H:i:s')
                                        ),
                                        array(
                                            'user_id'=>$r['user_id']
                                        )
                                    );
            if($this->User_model->authox($r['user_id']))
            {
                $this->session->set_userdata('user_id',$r['user_id']);
                $this->session->set_userdata('user_fullname',$r['fullname']);
                $this->session->set_userdata('user_name',$data['username']);
                $this->session->set_userdata('group_id',$r['group_id']);
                $this->User_model->get_group($r["group_id"]);
                $this->session->set_userdata('is_login', 'yes');
                exit(json_encode(array(
                            'status'=>true,
                            'message'=>'登录成功'
                        )
                    )
                );
            }
            else
            {
                exit(json_encode(array(
                            'status'=>false,
                            'message'=>'权限获取失败!'
                        )
                    )
                );
            }
        }
    }

}

