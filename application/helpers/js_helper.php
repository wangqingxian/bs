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
                $data=<<<ttt
{$data}
ttt;

            }

            $function.=<<<get
\$scope.model["$k"]={
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
\t\t\$scope.getdata["$k"]();
\r\n  
get;

        }
    }

    $temp.=<<<js
angular.module("ac")
    .controller("$sn",function(\$http,\$scope,\$stateParams)
    {
        \$scope.page="$sn";
        \$scope.getdata={};
        \$scope.show={};
        \$scope.model={};
        
        $function
        
    })
js;

    return $temp;
}