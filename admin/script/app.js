/**
 * Created by Administrator on 2017/2/9.
 */
angular.module("manageController",[]);
angular.module("authoxController",[]);
angular.module("userController",[]);
angular.module("moduleController",[]);
angular.module("htmlController",[]);
var app=angular.module("ac",
    [   "ui.router",
        "ui.bootstrap",
        "oc.lazyLoad",
        "ngMessages",
        "ngAnimate",
        "ui.tree",
        "meta.umeditor",
        "ui.router.requirePolyfill",
        "ng-echarts",
        "angular-cgs-utils",
        "appBase",
        "manageController",
        "authoxController",
        "userController",
        "moduleController",
        "htmlController"
    ]
).run(['$rootScope', function ($rootScope) {

}]);
app.config(["$stateProvider", "$urlRouterProvider","$ocLazyLoadProvider",
        function($stateProvider, $urlRouterProvider,$ocLazyLoadProvider)
        {
            $urlRouterProvider
                .when("","/index/system")
                .when("/index","index/system")
                .when("/authox","/authox/user")
                .when("/user","/user/manage")
                .when("/module","/module/manage")
                .when("/module/modify","/module/modify/info")
                .when("/html","/html/router")
                .otherwise("/index/system");

            $stateProvider
                .state("root",{
                    url:"/",
                    template:"<div></div>",
                    params:{to:"",toParams:{}},
                    resolve:{
                        rootAuthox:function ($http) {
                            return $http.get("manage/menu")
                        }
                    },
                    controller:function ($rootScope,rootAuthox,$stateParams,$state)
                    {

                        $rootScope.rootAuthox=rootAuthox.data.data;

                        if($stateParams.hasOwnProperty('to'))
                        {
                            if($stateParams.to!="")
                                to=$stateParams.to;
                            else
                                to="index";
                            par=$stateParams.toParams;
                        }
                        else
                        {
                            to="index";
                        }
                        $state.go(to,par);
                    }
                })
                .state("index",{
                    url:"/index",
                    templateUrl:"admin/partial/manage/manage.html",
                })
                .state("index.system",{
                    url:"/system",
                    templateUrl:"admin/partial/manage/system.html"
                })
                .state("index.dash",{
                    url:"/dash",
                    templateUrl:"admin/partial/manage/dash.html"
                })
                .state("authox",{
                    url:"/authox",
                    templateUrl:"admin/partial/authox/authox.html"
                })
                .state("authox.user",{
                    url:"/user",
                    templateUrl:"admin/partial/authox/user.html"
                })
                .state("authox.controller",{
                    url:"/controller",
                    templateUrl:"admin/partial/authox/controller.html"
                })
                .state("authox.method",{
                    url:"/method",
                    templateUrl:"admin/partial/authox/method.html"
                })
                .state("authox.group",{
                    url:"/group",
                    templateUrl:"admin/partial/authox/group.html"
                })
                .state("user",{
                    url:"/user",
                    templateUrl:"admin/partial/user/user.html"
                })
                .state("user.manage",{
                    url:"/manage",
                    templateUrl:"admin/partial/user/manage.html"
                })
                .state("user.add",{
                    url:"/add",
                    templateUrl:"admin/partial/user/add.html"
                })
                .state("user.modify",{
                    url:"/modify/:id",
                    templateUrl:"admin/partial/user/modify.html"
                })
                .state("user.password",{
                    url:"/password/:id/:username",
                    templateUrl:"admin/partial/user/password.html"
                })
                .state("module",{
                    url:"/module",
                    templateUrl:"admin/partial/module/module.html"
                })
                .state("module.manage",{
                    url:"/manage",
                    cache:false,
                    templateUrl:"admin/partial/module/manage.html"
                })
                .state("module.add",{
                    url:"/add",
                    templateUrl:"admin/partial/module/add.html"
                })
                .state("module.create",{
                    url:"/create/:id",
                    templateUrl:"admin/partial/module/create.html"
                })
                .state("module.last",{
                    url:"/last/:id",
                    templateUrl:"admin/partial/module/last.html"
                })
                .state("module.modify",{
                    url:"/modify",
                    templateUrl:"admin/partial/module/modify.html"
                })
                .state("module.modify.info",{
                    params:{"id":null},
                    url:"/info/:id",
                    templateUrl:"admin/partial/module/info.html"
                })
                .state("module.modify.field",{
                    url:"/field/:id",
                    templateUrl:"admin/partial/module/field.html"
                })
                .state("module.modify.check",{
                    url:"/check/:id",
                    templateUrl:"admin/partial/module/check.html"
                })
                .state("module.api_add",{
                    url:"/api/add/:module",
                    resolve:{
                        moduleApi:function ($http,$stateParams)
                        {
                            return $http.post("module/info",{module_id:$stateParams.module})
                        }
                    },
                    controller:function ($scope,moduleApi,$stateParams,$state)
                    {
                        if($stateParams.hasOwnProperty('module'))
                        {
                            $scope.module_mx=moduleApi.data.data;
                            $scope.module={
                                add:"",
                                delete:"",
                                page:"",
                                modify:""
                            };
                            $scope.module.add="api/"+angular.lowercase($scope.module_mx["module"])+"/add";
                            $scope.module.delete="api/"+angular.lowercase($scope.module_mx["module"])+"/delete";
                            $scope.module.page="api/"+angular.lowercase($scope.module_mx["module"])+"/page";
                            $scope.module.modify="api/"+angular.lowercase($scope.module_mx["module"])+"/modify";
                        }
                        else
                        {
                            $state.go("module.manage",{},{reload:true});
                        }
                    },
                    templateUrl:function ($stateParams)
                    {
                        if($stateParams.hasOwnProperty('module'))
                            return "module/api_form/apiAdd/"+$stateParams.module;
                        else
                            return "module/api_form/apiAdd/"
                    }
                })
                .state("module.api_modify",{
                    url:"/api/modify/:module/:primaryKey",
                    templateUrl:function ($stateParams)
                    {
                        if($stateParams.hasOwnProperty("module")&&$stateParams.hasOwnProperty("primaryKey"))
                            return "module/api_form/apiModify/"+$stateParams.module+"/"+$stateParams.primaryKey+"/";
                        else
                            return "module/api_form/apiModify/";
                    }
                })
                .state("module.api",{
                    url:"/api/:module",
                    resolve:{
                        moduleApi:function ($http,$stateParams)
                        {
                            return $http.post("module/info",{module_id:$stateParams.module})
                        }
                    },
                    controller:function ($scope,moduleApi,$stateParams,$state)
                    {
                        if($stateParams.hasOwnProperty('module'))
                        {
                            $scope.module_mx=moduleApi.data.data;
                            $scope.module={
                                add:"",
                                delete:"",
                                page:"",
                                modify:""
                            };
                            $scope.module.add="api/"+angular.lowercase($scope.module_mx["module"])+"/add";
                            $scope.module.delete="api/"+angular.lowercase($scope.module_mx["module"])+"/delete";
                            $scope.module.page="api/"+angular.lowercase($scope.module_mx["module"])+"/page";
                            $scope.module.modify="api/"+angular.lowercase($scope.module_mx["module"])+"/modify";
                        }
                        else
                        {
                            $state.go("module.manage",{},{reload:true});
                        }
                    },
                    templateUrl:function ($stateParams)
                    {
                        if($stateParams.hasOwnProperty('module'))
                            return "module/api/"+$stateParams.module;
                        else
                            return "module/api/"
                    },
                })
                .state("html",{
                    url:"/html",
                    templateUrl:"admin/partial/html/html.html"
                })
                .state("html.router",{
                    url:"/router",
                    templateUrl:"admin/partial/html/router.html"
                })
                .state("html.template",{
                    url:"/template",
                    templateUrl:"admin/partial/html/template.html"
                })
                .state("html.edit",{
                    url:"/edit", //只能看生成的源码
                    templateUrl:"admin/partial/html/edit.html"
                })
                .state("error",{ //TODO:更换404,没有权限页面
                    url:"/error/:id",
                    // templateUrl:function ($stateParams) {
                    //     return "welcome/test6/"+$stateParams.id;
                    // }
                    templateUrl:"admin/script/error/test.html",
                })
                .state("other",{//TODO：测试
                    url:"/other",
                    template:"<div>dassssssss</div>"
                })
        }
    ]
);
app.controller("root",function ($rootScope,$http,$scope,$state)
{

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams)
    {
        if(toState.name=="error")
        {
            console.log("error");
        }
        else if(toState.name!="root"&&!$rootScope.hasOwnProperty("rootAuthox"))
        {
            event.preventDefault();
            $state.go("root",{to:toState.name,toParams:toParams});
        }
        else
        {
            sref=toState.name.split(".");
            if(sref[0]!="root")
            {
                flag=true;
                for(i in $rootScope.rootAuthox)
                {
                    if($rootScope.rootAuthox[i].sref==sref[0])
                    {
                        flag=false;
                    }
                }
                if(flag)
                {
                    event.preventDefault();
                    $state.go("error");
                }
            }
        }

    });
})
app.controller("loginCtrl",function ($scope,$http)
{
    $scope.reload=function ()
    {
        $http.get("reload")
            .success(function (result)
            {
                if(result.message.indexOf("超时")>0)
                {
                    //TODO:暂时alert  之后改成弹出快速登录弹窗
                    alert(result.message);
                }
                else
                {
                    alert(result.message);
                }
            })
    }
})