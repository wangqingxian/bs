/**
 * Created by Administrator on 2017/2/14.
 */
angular.module("authoxController")
.controller("controllerCtrl",function ($rootScope,$scope,$http,$authoxAction,$checkboxCtr,$uibModal)
{
    //查询条件
    $scope.model={
        pageNum:1,
        pageSize:10,
        select:[],
        like:{}
    }
    $scope.searchdata="";
    //获取数据
    $scope.getdata=function ()
    {
        $http.post($authoxAction.controllerPage,$scope.model)
            .success(function (result)
            {
                if(result.status=="true" || result.status==true)
                {
                    $scope.data=result;
                    $scope.show=result.data;
                    $scope.dataSize=result.dataSize;
                }
                else
                {
                    $scope.data={};
                    $scope.show=[];
                    $scope.dataSize=0;
                    alert(result.message);
                }
            })
            .error(function ()
            {
                alert("服务器链接失败！");
                $scope.data={};
                $scope.show=[];
                $scope.dataSize=0;
            })
    }
    $scope.getdata();
    //查询
    $scope.newsearch=function ()
    {
        if($scope.searchdata!="")
        {
            $scope.model.pageNum=1;
            reg=/[\u4e00-\u9fa5]/;
            if(reg.test($scope.searchdata))
            {
                $scope.model.like.controller_name=$scope.searchdata;
            }
            else
            {
                $scope.model.like.controller=$scope.searchdata;
            }
            $scope.getdata();
        }
    }
    //清除查询条件
    $scope.clear=function () {
        $scope.searchdata="";
        $scope.model.pageNum=1;
        $scope.model.like={};
        $scope.getdata();
    }

    //换页
    $scope.changePage=function () {
        $scope.getdata();
    }

    //表格双击单选
    $scope.checkSingle = function(data, datas, $event)
    {
        $scope.allChecked = $checkboxCtr.checkSingle(data, datas, $event);
    };
    //全选功能
    $scope.checkAll = function(state, datas, $event)
    {
        $scope.allChecked = $checkboxCtr.checkAll(state, datas, $event);
    };
    //获取当前选中的数据
    $scope.getselect=function () {
        var select=[];
        angular.forEach($scope.show,function (value,key,array) {
            if(value.checked)
            {
                this.push(value);
            }
        },select)
        return select;
    }
    //删除 可批量删除
    $scope.del=function ()
    {
        var del=$scope.getselect();
        if(del.length>0)
        {
            var modalInstance=$uibModal.open({
                templateUrl:$authoxAction.deleteTemplate,
                controller:"controllerDeleteCtrl",
                backdrop : "static",
                resolve:{
                    data:function () {
                        return angular.copy(del);
                    }
                }
            });
            modalInstance
                .result.then(function ()
            {
                $scope.getdata();
            },function(){});
        }
    }
    //添加数据
    $scope.add=function ()
    {
        var modalInstance=$uibModal.open({
            templateUrl:$authoxAction.controllerEditTemplate,
            controller:"controllerEditCtrl",
            backdrop : "static",
            resolve:{
                isNew:function () {
                    return true;
                },
                edit:function () {
                    return "";
                }
            }
        });
        modalInstance
            .result.then(function ()
        {
            $scope.getdata();
        },function(){});
    }
    //修改数据 只能修改单条数据
    $scope.modify=function ()
    {
        var mod=$scope.getselect();
        if(mod.length>1)
        {
            alert("一次只能修改一条！");
        }
        else if(mod.length==1)
        {
            var modalInstance=$uibModal.open({
                templateUrl:$authoxAction.controllerEditTemplate,
                controller:"controllerEditCtrl",
                backdrop : "static",
                resolve:{
                    isNew:function () {
                        return false;
                    },
                    edit:function () {
                        return angular.copy(mod[0]);
                    }
                }
            });
            modalInstance
                .result.then(function ()
            {
                $scope.getdata();
            },function(){});
        }
    }
})
.controller("controllerEditCtrl",function ($rootScope,$scope,$http,$authoxAction,$uibModalInstance,isNew,edit)
{
        $scope.isNew=isNew;
        if(!$scope.isNew)
        {
            $scope.edit=edit;
        }
        $scope.cancel = function() {
            $uibModalInstance.dismiss("cancel");
        };
        //添加
        $scope.add=function ()
        {
            $http.post($authoxAction.controllerAdd,$scope.edit)
                .success(function (result)
                {
                    $uibModalInstance.close(true);
                    if(result.status==false)
                    {
                        alert(result.message);
                    }
                })
                .error(function ()
                {
                    alert("服务器链接失败！");
                    $scope.cancel();
                });
        }
        //修改
        $scope.modify=function ()
        {
            $http.post($authoxAction.controllerModify,$scope.edit)
                .success(function (result)
                {
                    $uibModalInstance.close(true);
                    if(result.status==false)
                    {
                        alert(result.message);
                    }
                })
                .error(function ()
                {
                    alert("服务器链接失败！");
                    $scope.cancel();
                })
        }
    })
.controller("controllerDeleteCtrl",function ($rootScope,$scope,$http,$authoxAction,$uibModalInstance,data)
{
        $scope.data=data;
        $scope.num=$scope.data.length;
        $scope.cancel = function() {
            $uibModalInstance.dismiss("cancel");
        };
        //删除
        $scope.del=function ()
        {
            $http.post($authoxAction.controllerDelete,$scope.data)
                .success(function (result)
                {
                    $uibModalInstance.close(true);
                    if(result.status==false)
                    {
                        alert(result.message);
                    }
                })
                .error(function ()
                {
                    alert("服务器链接失败！");
                    $scope.cancel();
                });
        }
    })