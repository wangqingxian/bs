<?php

/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2017/2/7
 * Time: 14:29
 */
class Logout extends CI_Controller
{
    /**
     * 退出登录 删除session
     */
    function index()
    {
        $this->session->sess_destroy();

        $time=time()-$this->config->item("sess_expiration");
        $this->db->where("timestamp < ",$time)->delete($this->config->item("sess_save_path"));
        redirect("login");
    }
}