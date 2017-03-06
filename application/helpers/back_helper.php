<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2017/2/6
 * Time: 16:35
 */
if ( ! defined('BASEPATH')) exit('No direct script access allowed');

function back($code="404")
{
    if($code=="404")
    {
        return json_encode(array(
            'code'=>'404',
            'status'=>false,
            'message'=>"请求失败！"
        ));
    }
}