<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2017/2/23
 * Time: 15:22
 */
function api($input)
{
    if(!is_array($input))
    {
        return false;
    }
    if(isset($input["name"]))
    {
        $name=$input['name'];
    }
    else
    {
        return false;
    }
    if (isset($input["extends"]))
    {
        $extends=$input["extends"];
    }
    else
    {
        return false;
    }
    if (isset($input["construct"])&&is_array($input["construct"]))
    {
        $construct=$input["construct"];
    }
    else
    {
        return false;
    }
    $con="";
    foreach ($construct as $key=>$value)
    {
        if($value===true)
            $con.="\t\t\$this->".$key."=true;\r\n";
        else if($value===false)
            $con.="\t\t\$this->".$key."=false;\r\n";
        else
            $con.="\t\t\$this->".$key."=\"".$value."\";\r\n";
    }
    $con.="\t\tparent::__construct();";
$temp=<<<temp
<?php 
defined('BASEPATH') OR exit('No direct script access allowed');

class $name extends $extends 
{
    public function __construct()
    {
$con
    }
}
temp;
    return $temp;
}