<?php
if (!defined('BASEPATH')) exit('No direct script access allowed');

/*
*/

class User_model extends Base_Model
{

    public function __construct()
    {
        $this->table_name = 'user';
        parent::__construct();
    }

    function authox($user_id)
    {
        //获取所属的权限
        $sql = 'select b.controller,b.function
                        from ac_user as a,
                            ac_authox as b
                        where a.user_id= ?
                            and b.user_id=a.user_id';
        $authorityData = $this->db->query($sql,array($user_id))->result_array();
        if(count($authorityData)>=0)
        {
            $sql2="select b.controller,b.function
                    from ac_user as a,
                         ac_group_detail as b
                    where a.user_id= ?
                        and b.group_id=a.group_id";
            $authorityData2=$this->db->query($sql2,array($user_id))->result_array();
            if(count($authorityData2)>=0)
            {
                $this->load->helper("array");
                $auth=authox_merge_two($authorityData,$authorityData2);
                $this->session->set_userdata('authorityData', $auth);
                return true;
            }
            else
            {
                return false;
            }
        }
        else
        {
            return false;
        }
    }

    function get_group($group_id)
    {

        if($res=$this->db->get_where("ac_group",array("group_id"=>$group_id)))
        {
            $q=$res->result_array();
            if(count($q)>0)
            {
                $group_name=array_key_exists("group_name",$q[0])?$q[0]["group_name"]:"";
            }
            else
            {
                $group_name="";
            }
            $this->session->set_userdata("group_name",$group_name);
        }
    }

    function _count($input,$is_like=true)
    {

        if($is_like)
        {
            if(is_array($input))
            {
                if (count($input) > 0){
                    $this->db->like($input);
                }
            }
        }
        else
        {
            if(is_array($input))
            {
                if(count($input)>0)
                {
                    $this->db->where($input);
                }
            }
        }
        $this->db->from($this->table_name);
        return $this->db->count_all_results();
    }

    function page($input,$is_like=true)
    {
        if(is_array($input))
        {
            $select=array_key_exists("select", $input)?$input["select"]:"*";
            $like=array_key_exists("like", $input)?$input["like"]:"";
            $order=array_key_exists("order", $input)?$input["order"]:array("user_id"=>"DESC");
            $pagenum=array_key_exists("pageNum", $input)?$input["pageNum"]:1;
            $pagesize=array_key_exists("pageSize", $input)?$input["pageSize"]:10;
        }
        else
        {
            return array(
                "status"=>false,
                "message"=>"查询参数错误"
            );
        }

        $datasize=$this->_count($like,$is_like);

        $pagenum = max(intval($pagenum), 1);
        $offset = $pagesize * ($pagenum - 1);
        if ($offset > $datasize) {
            $pagenum = round($datasize / $pagesize);
            $offset = max($pagesize * ($pagenum - 1), 0);
        }


        if (is_array($select)) {
            $this->db->select(implode(',', $select));
        } else {
            $this->db->select($select);
        }

        $this->db->from($this->table_name);

        if(is_array($like))
        {
            if (count($like) > 0){
                if($is_like)
                {
                    $this->db->or_like($like);
                }
                else
                {
                    $this->db->where($like);
                }
            }
        }
        $this->db->join('ac_group', 'ac_group.group_id = ac_user.group_id',"left");
        if (is_array($order))
        {
            foreach ($order as $key=>$value)
            {
                $this->db->order_by($key,$value);
            }
        }

        $this->db->limit($pagesize,$offset);



        if($Q = $this->db->get())
        {
            $datalist = array(
                "status"=>true,
                "code"=>200,
                "message"=>"分页成功",
                "dataSize"=>$datasize,
                "pageNum"=>$pagenum,
                "pageSize"=>$pagesize,
                "data"=>$Q->result_array()
            );

            $Q->free_result();
            return $datalist;

        }
        else
        {
            return false;
        }

    }

    function add($data)
    {
        if(count($data) == count($data,1))
        {

            return $this->db->insert($this->table_name, array_merge($data,array(
                'reg_ip' => $this->input->ip_address(),
                'reg_time' => date('Y-m-d H:i:s'),
                'last_login_ip' => $this->input->ip_address(),
                'last_login_time' => date('Y-m-d H:i:s'),
            )));
        }
        else
        {
            return $this->db->insert($this->table_name, array_merge($data[0],array(
                'reg_ip' => $this->input->ip_address(),
                'reg_time' => date('Y-m-d H:i:s'),
                'last_login_ip' => $this->input->ip_address(),
                'last_login_time' => date('Y-m-d H:i:s'),
            )));
        }

    }

    function deletes($input)
    {
        if(is_array($input)&&count($input)>0)
        {
            if(array_key_exists("user_id",$input))
            {
                $res=$this->db->where("user_id",$input["user_id"])
                    ->delete($this->table_name);
                if($res)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
            else if(array_key_exists("user_id",$input[0]))
            {
                $del=array_column($input,"user_id");
                $res=$this->db->where_in("user_id",$del)->delete($this->table_name);
                if($res)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
        }
        else
        {
            return false;
        }
    }

    function modify($input)
    {
        if(is_array($input)&&count($input)>0)
        {
            if(array_key_exists("user_id",$input))
            {
                $this->load->helper("array");
                $res=$this->db->where("user_id",$input["user_id"])
                    ->update($this->table_name,array_remove($input,"user_id"));
                if($res)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
            else
            {
                return false;
            }
        }
        else
        {
            return false;
        }
    }

    function detail($input)
    {
        if(is_array($input)&&count($input)>0)
        {
            if(array_key_exists("user_id",$input))
            {
                $select=array_key_exists("select",$input)?$input["select"]:"*";
                if(is_array($select)&&count($select)>0)
                {
                    $select=implode(",",$select);
                }
                $res=$this->db->select($select)
                    ->where("user_id",$input["user_id"])
                    ->from($this->table_name)
                    ->get();
                if($res)
                {
                    $datalist=array(
                        "code"=>200,
                        "status"=>true,
                        "message"=>"获取详情成功",
                        "data"=>$res->result_array()[0]
                    );
                    $res->free_result();
                    return $datalist;
                }
                else
                {
                    return false;
                }
            }
            else
            {
                return array("code"=>"501","status"=>false,"message"=>'查询参数错误');
            }
        }
        else
        {
            return array("code"=>"501","status"=>false,"message"=>'查询参数错误');
        }
    }

    function check_username_exists($username)
    {
        $c = $this->count("username ='" . $username . "' or email = '" . $username . "'");
        return $c;
    }

    function quick_register($username, $password, $encrypt = '',$fullname='',$group_id="")
    {

            $password = md5(md5($password . $encrypt));
            $newid = $this->insert(array(
                'username' => $username,
                'password' => $password,
                'fullname'=>$fullname,
                'group_id'=>$group_id,
                'reg_ip' => $this->input->ip_address(),
                'reg_time' => date('Y-m-d H:i:s'),
                'encrypt' => $encrypt,
                'last_login_ip' => $this->input->ip_address(),
                'last_login_time' => date('Y-m-d H:i:s'),
                ));

            return $newid;

    }

    function quick_changpwd($user_id,$password, $encrypt = '')
    {

            $password = md5(md5($password . $encrypt));
            $status = $this->update(array(
                                        'encrypt' => $encrypt,
                                        'password' => $password,
                                        ),
                                    array('user_id' => $user_id)
                                );

            return $status;

    }


}