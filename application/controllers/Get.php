<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2017/3/29
 * Time: 15:43
 */
use League\Flysystem\Filesystem;
use League\Flysystem\Adapter\Local;

class Get extends CI_Controller
{
    private $adapter;
    private $file;

    public function __construct()
    {
        parent::__construct();
        $this->adapter = new Local(FCPATH."user/");
        $this->file = new Filesystem($this->adapter);
    }

    function html()
    {
        $html=$this->uri->segment(3,false);

        if($html===false)
        {
            show_error("文件不存在",400,"error");
            die();
        }
        else
        {
            $t=explode(".",$html);
            if($t[count($t)-1]=="html")
            {
                $sn=substr($html,0,-5);
                if($this->file->has($html))
                {
                    $content=$this->file->read($html);
                    echo "<div ng-controller='$sn'>";
                    echo $content;
                    echo "</div>";
                    echo "<script src='user/$sn.js'></script>";
                }
                else
                {
                    show_404();
                    die();
                }
            }
            else
            {
                show_error("文件格式错误",400,"error");
                die();
            }
        }
    }
}