/**
 * Created by Administrator on 2017/2/21.
 */
angular.module("moduleController")
.controller("moduleCreateCtrl",function ($scope,$http,$moduleAction,$compile,$checkboxCtr,$state,$stateParams,uuid2)
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

    if(!$stateParams.hasOwnProperty("id"))
    {
        $state.go("module.manage");
    }
    $scope.edit={
        module_id:"",
        table:"",//表名 无前缀
        primary_key:"",//主键名称
        table_keys:{},
        keys:{}
    };
    $scope.keys=[];
    //$scope.keys=[{id:"",key:"xxx_id",key_name:"xxx主键",form:""},{...........}]
    $http.post($moduleAction.moduleDetail,{module_id:$stateParams.id})
        .success(function (result)
        {
            if(result.status)
            {
                $scope.edit.module_id=$stateParams.id;
                $scope.edit.table=result.data.module;
                $scope.edit.primary_key=angular.lowercase(result.data.module)+"_id";

                $scope.primary_key={
                    key:$scope.edit.primary_key,
                    key_name:$scope.edit.table+"自增主键",
                    primary:true,
                    type:"自增长ID",
                    form:"primary"
                };
            }
            else
            {
                alert(result.message);
            }
        })


    $scope.cancel = function ()
    {
        len=$scope.keys.length;

        $scope.edit.table_keys={};
        for(i=0;i<len;i++)
        {
            $scope.edit.table_keys[angular.lowercase($scope.keys[i].key)]=$scope.options[$scope.keys[i].form].type;
            $scope.edit.keys[angular.lowercase($scope.keys[i].key)]=$scope.keys[i];
            $scope.edit.keys[angular.lowercase($scope.keys[i].key)]["key"]=angular.lowercase($scope.keys[i]["key"]);
        }
        $scope.edit.table_keys[$scope.edit.primary_key]={
            type:"INT",
            constraint:11,
            auto_increment:true,
            unsigned:true
        };
        $scope.edit.keys[$scope.edit.primary_key]=$scope.primary_key;
        $http.post($moduleAction.moduleCreate,$scope.edit)
            .success(function (result)
            {
                $scope.re=result;
            })
        $state.go('module.manage',{},{reload:true});
    }

    $scope.add=function ()
    {
        $scope.keys.push({
            names:{
                key:uuid2.newid(),
                key_name:uuid2.newid(),
                form:uuid2.newid()
            }
        });
    }

    $scope.delete=function (item,index)
    {
        if($scope.keys[index]===item)
            $scope.keys.splice(index, 1);
    }

    $scope.next=function ()
    {
        len=$scope.keys.length;

        $scope.edit.table_keys={};
        for(i=0;i<len;i++)
        {
            $scope.edit.table_keys[angular.lowercase($scope.keys[i].key)]=$scope.options[$scope.keys[i].form].type;
            $scope.edit.keys[angular.lowercase($scope.keys[i].key)]=$scope.keys[i];
            $scope.edit.keys[angular.lowercase($scope.keys[i].key)]["key"]=angular.lowercase($scope.keys[i]["key"]);
        }
        $scope.edit.table_keys[$scope.edit.primary_key]={
            type:"INT",
            constraint:11,
            auto_increment:true,
            unsigned:true
        };
        $scope.edit.keys[$scope.edit.primary_key]=$scope.primary_key;

        $http.post($moduleAction.moduleCreate,$scope.edit)
            .success(function (result)
            {
                if(result.status)
                {
                    $state.go("module.last",{id:$stateParams.id});
                }
                else
                {
                    alert(result.message);
                }
            })
    }
})
