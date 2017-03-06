<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2017/1/22
 * Time: 16:04
 * @property array_helper $array_helper
 */
function array_remove($data, $key)
{
    if(!array_key_exists($key, $data)){
        return $data;
    }
    $keys = array_keys($data);
    $index = array_search($key, $keys);
    if($index !== FALSE){
        array_splice($data, $index, 1);
    }
    return $data;

}

function array_remove_void(&$data, $key)
{
    if(!array_key_exists($key, $data)){
        return $data;
    }
    $keys = array_keys($data);
    $index = array_search($key, $keys);
    if($index !== FALSE){
        array_splice($data, $index, 1);
    }

}

function is_assoc($arr){
    return (bool)count(array_filter(array_keys($arr), 'is_string'));
}

/**
 * 两个二维数组计较 array1-array2
 * @param $array1
 * @param $array2
 * @return array
 * 原因不明的错误
 */
//function array_diff_assoc2_deep($array1, $array2) {
//    $ret = array();
////    $array1-$array2
//    foreach ($array1 as $k => $v)
//    {
//        if (!isset($array2[$k]))
//            $ret[$k] = $v;
//        else if (is_array($v) && is_array($array2[$k]))
//            $ret[$k] = array_diff_assoc2_deep($v, $array2[$k]);
//        else if ($v !=$array2[$k])
//            $ret[$k] = $v;
//        else
//        {
//            unset($array1[$k]);
//        }
//    }
//    return array_filter($ret);
//}


/**
 * 求出a1和a2的并集 去除重复项
 * @param $a1
 * @param $a2
 * @return array
 */
//function array_merge_two($a1,$a2)
//{
////    $a1+($a2-$a1)
//    $t=array_diff_assoc2_deep($a2,$a1);
//    //$m=array_diff($a2,$a1);
//    return array_merge($a1,$t);
//}

function authox_merge_two($a1,$a2)
{
//    $a1+($a2-$a1)
    $res=$a1;
    foreach ($a2 as $key=>$value)
    {
        $flag=true;
        foreach ($a1 as $k=>$v)
        {
            if($v["controller"]===$value["controller"]&&$v["function"]===$value["function"])
            {
                $flag=false;
                break;
            }
        }
        if($flag)
        {
            array_push($res,$value);
        }
    }
    //$m=array_diff($a2,$a1);
    return $res;
}

/**
 * 一维数组去重
 * 默认索引数组去重
 * is_index=false则为关联数组
 * @param $arr
 * @param $is_index boolean
 * @return array
 */
function array_no_repeat($arr,$is_index=true)
{
    $arr = array_flip($arr);
    $arr = array_flip($arr);
    if($is_index)
        $arr = array_values($arr);

    return $arr;
}



function utf_substr($str,$len){
    for($i=0;$i<$len;$i++){
        $temp_str=substr($str,0,1);
        if(ord($temp_str) > 127){
            $i++;
            if($i<$len){
                $new_str[]=substr($str,0,3);
                $str=substr($str,3);
            }
        }else{
            $new_str[]=substr($str,0,1);
            $str=substr($str,1);
        }
    }
    return join($new_str);
}