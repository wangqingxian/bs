<?php

class LogicMy extends CI_Controller
{

    public $CI = "";

    function LogicMy()
    {
        $this->CI =&get_instance();
    }

    /************** __construct方法里的详细逻辑 **************************/

    function judgeAuthority($controller, $function)
    {
        $controller=strtolower($controller);
        $function=strtolower($function);

        $authorityData = $this->CI->session->userdata('authorityData');
        if(empty($authorityData))
        {
            return array('responseCode' => '100', 'responseMessage' => '没有权限');
        }
        foreach ($authorityData as $k => $v)
        {

            if (strtolower($v['controller']) == $controller
                    && strtolower($v['function']) == $function )
            {
                return array('responseCode' => '101', 'responseMessage' => '可以访问');
                break;
            }
        }
        return array('responseCode' => '100', 'responseMessage' => '没有权限');
    }

    /************** __construct方法里的详细逻辑 **************************/


}








