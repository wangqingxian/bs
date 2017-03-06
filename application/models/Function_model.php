<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2017/2/14
 * Time: 13:57
 */
class Function_model extends Api_Model
{
    public function __construct()
    {
        $this->table_name="function";
        $this->primary="function_id";
        $this->db_tablepre="ac_";
        parent::__construct();
    }
}