<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2017/2/6
 * Time: 8:16
 */
defined('BASEPATH') OR exit('No direct script access allowed');

$config['svn_repository']="https://localhost:8443/svn/test";
$config['svn_user']="test";
$config['svn_password']="123456";

$config["super_admin"]="";
$config["super_password"]="";
$config["ac_title"]="我的个人网站";

$config['ac_status'] = array (
    'systemVersion' => '1.0.0',
    'install' => true,    //判断是否安装
    //TODO: 安装文件记得改成false
);