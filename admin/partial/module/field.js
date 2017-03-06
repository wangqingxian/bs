/**
 * Created by Administrator on 2017/2/27.
 */
angular.module("moduleController")
.controller("moduleFieldCtrl",function ($scope,$rootScope,$http,$stateParams,$state,$moduleAction,$uibModal)
{
    if ($stateParams.hasOwnProperty('id'))
        $rootScope.moduleModifyCtrlID = $stateParams.id;
    else
        $state.go("module.manage");

    $scope.options= {
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

    $scope.edit = {};
    $scope.getdata=function ()
    {
        $http.post($moduleAction.moduleInit, {module_id: $stateParams.id})
            .success(function (result) {
                if (result.status) {
                    $scope.edit = result.data;
                }
                else {
                    alert(result.message);
                }
            })
    }
    $scope.getdata();

    $scope.cancel=function ()
    {
        $state.go("module.manage",{},{reload:true});
    }

    $scope.next = function ()
    {
        $state.go("module.modify.check", {id: $stateParams.id}, {reload: true});
    }

    $scope.add_field=function ()
    {
        var modalInstance = $uibModal.open({
            templateUrl: $moduleAction.moduleAddFieldTemplate,
            controller: "moduleAddFieldCtrl",
            backdrop: "static",
            resolve: {
                module_id:function ()
                {
                    return angular.copy($stateParams.id);
                }
            }
        });
        modalInstance
            .result.then(function ()
            {
                $scope.getdata();
            }, function () {
            });
    }

    $scope.delete_field=function (field)
    {
        var modalInstance = $uibModal.open({
            templateUrl: $moduleAction.moduleDeleteFieldTemplate,
            controller: "moduleDeleteFieldCtrl",
            backdrop: "static",
            resolve: {
                module_id:function ()
                {
                    return angular.copy($stateParams.id);
                },
                field:function ()
                {
                    return angular.copy(field);
                }
            }
        });
        modalInstance
            .result.then(function ()
        {
            $scope.getdata();
        }, function () {
        });
    }

    $scope.modify_field=function (field)
    {
        var modalInstance = $uibModal.open({
            templateUrl: $moduleAction.moduleModifyFieldTemplate,
            controller: "moduleModifyFieldCtrl",
            backdrop: "static",
            resolve: {
                module_id:function ()
                {
                    return angular.copy($stateParams.id);
                },
                field:function ()
                {
                    return angular.copy(field);
                }
            }
        });
        modalInstance
            .result.then(function ()
        {
            $scope.getdata();
        }, function () {
        });
    }

})
.controller("moduleAddFieldCtrl",function ($scope,$rootScope,$http,$uibModalInstance,$moduleAction,module_id)
{
    $scope.options= {
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
    $scope.item={};
    $scope.edit={
        module_id:module_id,
        keys:[],
        field:{}
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss("cancel");
    };

    $scope.add=function ()
    {
        $scope.edit.keys=$scope.item;
        $scope.edit.field={};
        $scope.edit.field[$scope.item.key]=$scope.options[$scope.item.form].type;
        $http.post($moduleAction.moduleAddField,$scope.edit)
            .success(function (result)
            {
                if(result.status)
                {
                    $uibModalInstance.close(true);
                }
                else
                {
                    alert(result.message);
                }
            })
    }

})
.controller("moduleDeleteFieldCtrl",function ($scope,$rootScope,$http,$uibModalInstance,$moduleAction,module_id,field)
{
    $scope.cancel = function () {
        $uibModalInstance.dismiss("cancel");
    };
    $scope.field=field;
    $scope.edit={};
    $scope.edit.key=field.key;
    $scope.edit.module_id=module_id;
    $scope.del = function () {

        $http.post($moduleAction.moduleDeleteField, $scope.edit)
            .success(function (result) {
                if (result.status) {
                    $uibModalInstance.close(true);
                }
                else {
                    alert(result.message);
                }
            })
    }

})
.controller("moduleModifyFieldCtrl",function ($scope,$rootScope,$http,$uibModalInstance,$moduleAction,module_id,field)
{
    $scope.options= {
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
    $scope.item = field;
    $scope.base=angular.copy(field.key);
    $scope.edit = {
        module_id: module_id,
        base:"",
        keys: [],
        field: {}
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss("cancel");
    };

    $scope.modify = function () {
        $scope.edit.base=$scope.base;
        $scope.edit.keys = $scope.item;
        $scope.edit.field = {};
        $scope.edit.field[$scope.base] = $scope.options[$scope.item.form].type;
        if($scope.base!==$scope.item.key)
        {
            $scope.edit.field[$scope.base]["name"]=$scope.item.key;
        }
        $http.post($moduleAction.moduleModifyField, $scope.edit)
            .success(function (result) {
                if (result.status) {
                    $uibModalInstance.close(true);
                }
                else {
                    alert(result.message);
                }
            })
    }

})

