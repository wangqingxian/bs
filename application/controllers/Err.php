<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2017/3/31
 * Time: 9:25
 */
class Err extends CI_Controller
{
    function index()
    {
        if($this->input->is_ajax_request())
        {
            echo json_encode(array(
                "status"=>false,
                "message"=>"未知错误",
                "data"=>array()
            ));
        }
        else
        {
            show_error("未知错误",400,"error");
        }
    }
}