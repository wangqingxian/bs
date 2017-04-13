<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2017/3/30
 * Time: 17:28
 */
function js($sn,$config)
{
    $temp="";
    $function="";
    $getdata=array_key_exists("getdata",$config)?$config["getdata"]:array();
    $pic=array_key_exists("pic",$config)?$config["pic"]:array();

    if(empty($getdata)||!is_array($getdata))
    {
        $function="";
    }
    else
    {
        foreach ($getdata as $k=>$v)
        {
            // 有data参数就不传$scope.model[$k]
            // $scope.model[$k]是要传的基本参数 pageNum ,pageSize, select:[] ,like:[]
            $show=array_key_exists("show",$v)?$v["show"]:"";
            $url=array_key_exists("url",$v)?$v["url"]:"error";
            $data=array_key_exists("data",$v)?$v["data"]:"";

            if(empty($show))
            {
                $show=<<<ttt
\$scope.show.push(result.data);
ttt;
            }
            else
            {
                $show=<<<ttt
\$scope.show["$show"]=result.data;
ttt;
            }
            if(empty($data))
            {
                $data="\$scope.model[\"$k\"]";
            }
            else
            {
                $data="{".$data."}";


            }

            $function.=<<<get
\t\t\$scope.model["$k"]={
    \t\tpageNum:1,
    \t\tpageSize:10,
    \t\tselect:[],
    \t\tlike:[]
\t\t}            
\t\t\$scope.getdata["$k"]=function()
\t\t{
    \t\t\$http.post("$url",$data)
        \t\t.success(function(result)
        \t\t{
            \t\tif(result.status)
            \t\t{
                \t\t$show
            \t\t}
        \t\t})
        \t\t.error(function(error)
        \t\t{
            \t\tconsole.log(error);
        \t\t})
\t\t}
\t\ttry 
\t\t{
    \t\t\$scope.getdata["$k"]();
\t\t} 
\t\tcatch (err)
\t\t{
    \t\tconsole.log(err);
\t\t}
\r\n  
get;

        }
    }

    $pics="\t\t\$scope.pic={\r\n";
    foreach ($pic as $k=>$v)
    {
        $pics.=<<<img
\t\t"$k":[\r\n
img;
        foreach ($v as $key=>$value)
        {
            $img=array_key_exists("image",$value)?$value["image"]:"";
            $text=array_key_exists("text",$value)?$value["text"]:"";
            $pics.=<<<img
\t\t\t{
\t\t\t\timage:"$img",
\t\t\t\ttext:"$text",
\t\t\t},

img;
        }
        $pics.=<<<img
\t\t\t],\r\n
img;

    }
    $pics.="\t\t}";
    $temp.=<<<js
angular.module("ac")
    .controller("$sn",function(\$http,\$scope,\$stateParams)
    {
        \$scope.page="$sn";
        \$scope.getdata={};
        \$scope.show={};
        \$scope.model={};
        \$scope.params=\$stateParams;

$function
$pics        
    
    })
js;

    return $temp;
}