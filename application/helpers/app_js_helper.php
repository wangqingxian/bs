<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2017/3/27
 * Time: 14:54
 */
function app_js($input)
{
    $state="";
    $when="";
    if(array_key_exists("config",$input))
    {
        if(array_key_exists("when",$input["config"]))
        {
            $when="\$urlRouterProvider\r\n"
                    ."\t\t.when(\"\",\"".$input['config']["when"]."\")\r\n"
                    ."\t\t.otherwise(\"".$input["config"]["when"]."\");\r\n";
        }

        if(array_key_exists("state",$input["config"]))
        {
            if(count($input['config']["state"])>0)
                $state="\$stateProvider\r\n";
            foreach ($input["config"]["state"] as $k=>$v)
            {
                $state.="\t\t.state(\"".$v['name']."\",{\r\n"
                        ."\t\t\t\"url\":\"".$v['url']."\",\r\n"
                        ."\t\t\t\"templateUrl\":\"get/html/".$v['template'].".html\"\r\n"
                        ."\t\t})\r\n";
            }
        }
    }
    $a=<<<js
const app=angular.module("ac",
        [
            "ui.router",
            "ui.bootstrap",
            "oc.lazyLoad",
            "ngMessages",
            "ngAnimate",
            "ui.tree",
            "ui.router.requirePolyfill",
            "ng-echarts",
            "angular-cgs-utils",
            "ngLodash",
            "colorpicker.module"
        ]);
app.run(function (\$rootScope) {

});
app.config(function(\$stateProvider, \$urlRouterProvider)
{
    $when
    $state        
})
js;
    return $a;
}