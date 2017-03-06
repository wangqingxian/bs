<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2017/2/7
 * Time: 10:11
 */
if (!defined('BASEPATH')) exit('No direct script access allowed');

class Authox_model extends Api_Model
{
    public function __construct()
    {
        $this->table_name = 'authox';
        $this->primary="authox_id";
        $this->db_tablepre="ac_";
        parent::__construct();
    }

    function add_authox($input)
    {
        if(is_array($input)&&array_key_exists("user_id",$input)&&!empty($input["user_id"]))
        {
            $data=array_key_exists("functions",$input)?$input["functions"]:array();

            $this->load->helper("array");
            //查询原先组拥有的权限
            $old=$this->db->where(array("user_id"=>$input["user_id"]))
                ->get($this->table_name)->result_array();
            $oids=array_column($old,"function_id");
            $dids=array_column($data,$this->primary);
            //计算新增的权限
            $news=array();
            foreach ($data as $key=>$value)
            {
                if(!in_array($value["function_id"],$oids))
                {
                    array_push($news,array(
                        "user_id"=>$input["user_id"],
                        "controller_id"=>$value["controller_id"],
                        "controller"=>$value["controller"],
                        "function_id"=>$value["function_id"],
                        "function"=>$value["function"]
                    ));
                }
            }
            //计算被删除的权限
            $del=array();
            foreach ($old as $key=>$value)
            {
                if(!in_array($value[$this->primary],$dids))
                {
                    array_push($del,$value[$this->primary]);
                }
            }


            //事务控制
            $this->db->trans_start();
            if(count($news)>0)
            {
                $this->db->insert_batch($this->table_name,$news);
            }
            if(count($del)>0)
            {
                $this->db->where_in($this->primary,$del)
                    ->delete($this->table_name);
            }
            $this->db->trans_complete();

            if ($this->db->trans_status() === FALSE)
            {
                return false;
            }
            else
            {
                return true;
            }
        }
        else
        {
            return false;
        }
    }


}