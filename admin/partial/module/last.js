/**
 * Created by Administrator on 2017/2/23.
 */
angular.module("moduleController")
.controller("moduleLastCtrl",function ($scope,$http,$moduleAction,$compile,$checkboxCtr,$state,$stateParams,uuid2)
{
    if (!$stateParams.hasOwnProperty("id"))
    {
        $state.go("module.manage");
    }

    $scope.options= {
        "primary":{id:"primary",name:"自增主键"},
        "text": {id:"text",group: "字符类", name: "单行文本", type:{type:"VARCHAR",constraint:"255","null":false}},
        "textuniuqe":{id:"textuniuqe",group:"字符类",name:"单行文本(唯一)",type:{type:"VARCHAR",constraint:"255","null":false}},
        "textarea":{id:"textarea",group:"字符类",name:"多行文本",type:{type:"LONGTEXT","null":false}},
        "document":{id:"document",group:"字符类",name:"富文本编辑器",type:{type:"VARCHAR",constraint:"255","null":false}},
        "number": {id:"number",group: "数字类", name: "整数", type: {type:"INT", constraint: "11","null":false}},
        "double": {id:"double",group: "数字类", name: "小数", type: {type:"DOUBLE","null":false}},
        "datetime":{id:"datetime",group:"时间类",name:"年-月-日 时:分:秒",type:{type:"DATETIME","null":false}},
        "tinyint":{id:"tinyint",group:"单选类",name:"单选(是,否)",type:{type:"TINYINT","default":false}},
        "upload":{id:"upload",group:"上传类",name:"文件上传",type:{type:"VARCHAR",constraint:"255","null":false}},
    };

    $http.post($moduleAction.moduleInfo, {module_id: $stateParams.id})
        .success(function (result) {
            if (result.status)
            {
                $scope.show=result.data;
            }
            else {
                alert(result.message);
            }
        })


    $scope.cancel = function () {
        $state.go('module.manage',{},{reload:true});
    }

    $scope.last = function ()
    {
        $http.post($moduleAction.moduleLast,{module_id:$stateParams.id})
            .success(function (result) {
                if (result.status) {
                    $scope.result=result;
                    $scope.success=true;
                }
                else {
                    alert(result.message);
                }
            })
    }
    $scope.check=function ()
    {
        window.open($scope.result.href);
    }
})