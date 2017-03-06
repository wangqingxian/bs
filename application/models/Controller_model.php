<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2017/2/13
 * Time: 14:36
 */
class Controller_model extends Api_Model
{
    public function __construct()
    {
        $this->table_name = 'controller';
        $this->primary="controller_id";
        $this->db_tablepre="ac_";
        parent::__construct();
    }
}