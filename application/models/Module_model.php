<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2017/2/20
 * Time: 10:26
 */
class Module_model extends Api_Model
{
    public function __construct()
    {
        $this->table_name="module";
        $this->primary="module_id";
        $this->db_tablepre="ac_";
        parent::__construct();
    }

    public function menu()
    {
        $input=array(
            "select"=>array("module_id","module_name","module_sref"),
            "pageNum"=>1,
            "pageSize"=>9999,
            "like"=>array("is_left"=>true)
        );

        return $this->page($input,false);
    }
}