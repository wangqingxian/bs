<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2017/3/13
 * Time: 9:34
 */
class Mistake extends CI_Controller
{

    function index()
    {
        show_error("未知的错误",101,"-_-");
    }
}