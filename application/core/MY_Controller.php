<?php

class MY_Controller extends CI_Controller
{
    public function __construct()
    {
        parent::__construct();
    }

}

/**
 * Class Authox_Controller
 * 初始化参数
 * $this->authox_start boolean 权限管理 默认关闭
 */
class Authox_Controller extends MY_Controller
{
    public $authox_start;
    public function __construct()
    {
        parent::__construct();

        $directory=strtolower(substr($this->router->directory, 0, -1));
        $controller = strtolower($this->router->class);
        $function = strtolower($this->router->method);

        if($controller=="manage"&& $directory!="api")
        {
            if (!$this->session->userdata('user_name')&&$this->session->userdata("is_login")!="yes")
            {
                // 用户未登陆
                if($this->input->is_ajax_request())
                {
                    exit(json_encode(array(
                                "status"=>false,
                                "message"=>"登陆超时"
                            )
                        )
                    );
                }
                else
                {
                    redirect(ROOTURL.'login');
                    return;
                }
            }
        }
        else if($controller=="html"&&$function="save")
        {

        }
        else if($controller==$this->router->default_controller)
        {

        }
        else
        {
            if(isset($this->authox_start) && $this->authox_start)
            {
                $this->load->library('logicmy');
                //判断是否有权限访问
                $returnData = $this->logicmy->judgeAuthority($controller, $function);
                $is_ajax = $this->input->is_ajax_request();
                if ($is_ajax)
                {
                    if ($returnData['responseCode'] == '101')
                    {

                    }
                    else if ($returnData["responseCode"]=="999")
                    {
                        exit(json_encode(array(
                            "status"=>false,
                            "message"=>"登录超时，请重新登录。"
                        )));
                    }
                    else if ($returnData['responseCode'] == '100')
                    {
                        exit(json_encode(array(
                                "status" => false,
                                "message" => "你没有权限"
                            )
                        )
                        );
                    }
                    else
                    {
                        exit(json_encode(array(
                                "status" => false,
                                "message" => "-_-我以为很绝望啊"
                            )
                        )
                        );
                    }
                }
                else
                {
                    if ($returnData['responseCode'] == '101')
                    {

                    }
                    else if ($returnData['responseCode'] == '100')
                    {
                        show_error('你没有权限', 101, '-_-');
                        exit();
                    }
                    else if ($returnData['responseCode'] == '999')
                    {
                        show_error('登陆超时', 101, '-_-');
                        exit();
                    }
                    else
                    {
                        show_404("-_-", "发生了什么？");
                    }
                }
            }
        }


    }
}

/**
 * Class Api_Controller
 * 初始化参数
 * $this->authox_start boolean 权限管理 默认关闭
 * $this->model_name 控制器对应的模块类的名字  无需后缀 默认与控制器同名 例如  authox_model 就是authox
 * 针对xxx_model 有部分json配置文件 默认在   models/base/xxx_model中
 * $this->model_suffix 模块类的名字后缀 默认模块命名为xxx_model 例如authox_model 就是_model
 * $this->available  模块是否被启用
 */
cLass Api_Controller extends Authox_Controller
{
    protected $model_name;
    public $model_suffix="_model";
    protected $_model;
    public $available;

    public function __construct()
    {
        parent::__construct();
        if(!$this->available)
        {
            if ($this->input->is_ajax_request())
            {
                exit(json_encode(array(
                            "status" => false,
                            "message" => "该模块没有被启用"
                        )
                    )
                );
            }
            else
            {
                show_error('该模块没有被启用',101, '-_-');
                exit();
            }
        }

        if(empty($this->model_name))
        {
            $this->model_name=$this->router->class;
        }
        $this->model_name=$this->model_name.$this->model_suffix;
        $_model_name=$this->model_name;
        $this->load->model($_model_name);
        $this->_model=$this->$_model_name;
    }

    final protected function _input ($method,$is_page=false)
    {
        $entity=json_decode(file_get_contents(MODEL_BASE.$this->model_name."/entity.json"));
        $page=$entity;
        array_push($page,"select","like","order","pageNum","pageSize");
        $deletes=$entity;
        array_push($deletes,"deletes",0,1,2,3,4,5,6,7,8,9);
        if(strtolower($_SERVER["REQUEST_METHOD"]) == 'post')
        {
            if($is_page===true&&$method=="page")
            {
                @$data=$this->input->post($page);
            }
            else if($method=="delete")
            {
                @$data=$this->input->post($deletes);
            }
            else
            {
                @$data=$this->input->post($entity);
            }
        }
        else if(strtolower($_SERVER["REQUEST_METHOD"]) == 'get')
        {
            if($is_page===true&&$method=="page")
            {
                @$data=$this->input->get($page);
            }
            else if($method=="delete")
            {
                @$data=$this->input->get($deletes);
            }
            else
            {
                @$data=$this->input->get($entity);
            }
        }

        $flag=false;
        foreach ($data as $k=>$v)
        {
            if(!is_null($v))
            {
                $flag=true;
                break;
            }
        }
        if($flag==false)
        {
            $an=json_decode($this->input->raw_input_stream);
            $an=json_decode(json_encode($an),true);
            $data=array();
            if(!is_array($an))
            {
                foreach($entity as $v)
                {
                    $data[$v]=null;
                }
            }
            else if($is_page)
            {
                foreach ($page as $v)
                {
                    $data[$v]=array_key_exists($v,$an)?$an[$v]:null;
                }
            }
            else if($method=="delete")
            {
                foreach ($deletes as $v)
                {
                    $data[$v]=array_key_exists($v,$an)?$an[$v]:null;
                }
            }
            else
            {
                foreach ($entity as $v)
                {
                    $data[$v]=array_key_exists($v,$an)?$an[$v]:null;
                }
            }
        }

        $this->load->helper("array");

        if($is_page)
        {
            foreach ($data as $key=>$value)
            {
                //去除null 去除不必要的元素
                if(is_null($data[$key])||!in_array($key,$page))
                {
                    array_remove_void($data,$key);
                }
            }
            if(array_key_exists("like",$data)&&is_array($data['like']))
            {
                return $data;
            }
            else
            {
                $temp=array();
                foreach ($entity as $item)
                {
                    if(array_key_exists($item,$data))
                    {
                        $temp[$item]=$data[$item];
                    }
                }
                $data["like"]=$temp;
                return $data;
            }
        }
        else if ($method=="delete")
        {
            if(count($data["deletes"]) !== count($data["deletes"], 1))
            {
                return $data["deletes"];
            }
            else
            {
                return $data;
            }
        }
        else
        {
            foreach ($data as $key=>$value)
            {
                //去除null 去除不必要的元素
                if(is_null($data[$key])||!in_array($key,$entity,true))
                {
                    array_remove_void($data,$key);
                }
            }
            return $data;
        }
    }

    public function add()
    {
        $input=$this->_input("add");
        if($this->_model->add($input))
        {
            $back=array(
                "code"=>200,
                "status"=>true,
                "message"=>"添加成功"
            );
        }
        else
        {
            $back=$this->db->error();
            $back["status"]=false;
        }

        echo json_encode($back);
    }

    public function delete()
    {
        $input=$this->_input("delete");
        if($this->_model->delete($input))
        {
            $back=array(
                "code"=>200,
                "status"=>true,
                "message"=>"删除成功"
            );
        }
        else
        {
            $back=$this->db->error();
            if(empty($back["message"]))
            {
                $back["message"]="参数错误!";
            }
            $back["status"]=false;
        }

        echo json_encode($back);
    }

    public function modify()
    {
        $input=$this->_input("modify");
        if($this->_model->modify($input))
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
            if(empty($back["message"]))
            {
                $back["message"]="参数错误";
            }
        }

        echo json_encode($back);
    }

    public function detail()
    {
        $input=$this->_input("detail");
        if($back=$this->_model->detail($input))
        {

        }
        else
        {
            $back=$this->db->error();
            $back["status"]=false;
        }

        echo json_encode($back);
    }

    public function page()
    {
        $input=$this->_input("page",true);
        if($back=$this->_model->page($input))
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