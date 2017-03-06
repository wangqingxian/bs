<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2017/2/14
 * Time: 16:01
 */
class Group_model extends Api_Model
{
    public function __construct()
    {
        $this->table_name = 'group';
        $this->primary="group_id";
        $this->db_tablepre="ac_";
        parent::__construct();
    }
}