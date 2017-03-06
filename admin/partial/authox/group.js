/**
 * Created by Administrator on 2017/2/14.
 */
angular.module("authoxController")
.controller("groupCtrl",function ($rootScope,$scope,$http,$authoxAction,$checkboxCtr,$uibModal)
{
    //查询条件
    $scope.model = {
        pageNum: 1,
        pageSize: 10,
        select: [],
        like: {}
    }
    $scope.searchdata = "";
    //获取数据
    $scope.getdata = function ()
    {
        $http.post($authoxAction.groupPage, $scope.model)
            .success(function (result)
            {
                if (result.status == "true" || result.status == true)
                {
                    $scope.data = result;
                    $scope.show = result.data;
                    $scope.dataSize = result.dataSize;
                }
                else
                {
                    $scope.data = {};
                    $scope.show = [];
                    $scope.dataSize = 0;
                    alert(result.message);
                }
            })
            .error(function ()
            {
                alert("服务器链接失败！");
                $scope.data = {};
                $scope.show = [];
                $scope.dataSize = 0;
            })
    }
    $scope.getdata();
    //查询
    $scope.newsearch = function ()
    {
        if ($scope.searchdata != "")
        {
            $scope.model.pageNum = 1;
            $scope.model.like.group_name=$scope.searchdata;
            $scope.getdata();
        }
    }
    //清除查询条件
    $scope.clear = function ()
    {
        $scope.searchdata = "";
        $scope.model.pageNum = 1;
        $scope.model.like = {};
        $scope.getdata();
    }

    //换页
    $scope.changePage = function ()
    {
        $scope.getdata();
    }

    //表格双击单选
    $scope.checkSingle = function (data, datas, $event)
    {
        $scope.allChecked = $checkboxCtr.checkSingle(data, datas, $event);
    };
    //全选功能
    $scope.checkAll = function (state, datas, $event)
    {
        $scope.allChecked = $checkboxCtr.checkAll(state, datas, $event);
    };
    //获取当前选中的数据
    $scope.getselect = function ()
    {
        var select = [];
        angular.forEach($scope.show, function (value, key, array) {
            if (value.checked) {
                this.push(value);
            }
        }, select)
        return select;
    }
    //删除 可批量删除
    $scope.del = function ()
    {
        var del = $scope.getselect();
        if (del.length > 0)
        {
            var modalInstance = $uibModal.open({
                templateUrl: $authoxAction.deleteTemplate,
                controller: "groupDeleteCtrl",
                backdrop: "static",
                resolve: {
                    data: function () {
                        return angular.copy(del);
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
    }
    //添加数据
    $scope.add = function ()
    {
        var modalInstance = $uibModal.open({
            templateUrl: $authoxAction.groupEditTemplate,
            controller: "groupEditCtrl",
            backdrop: "static",
            resolve: {
                isNew: function () {
                    return true;
                },
                edit: function () {
                    return "";
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
    //修改数据 只能修改单条数据
    $scope.modify = function ()
    {
        var mod = $scope.getselect();
        if (mod.length > 1)
        {
            alert("一次只能修改一条！");
        }
        else if (mod.length == 1)
        {
            var modalInstance = $uibModal.open({
                templateUrl: $authoxAction.groupEditTemplate,
                controller: "groupEditCtrl",
                backdrop: "static",
                resolve: {
                    isNew: function () {
                        return false;
                    },
                    edit: function () {
                        return angular.copy(mod[0]);
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
    }
    //权限修改
    $scope.authox=function (item,show)
    {
        $scope.checkSingle(item,show);
        var modalInstance = $uibModal.open({
                templateUrl: $authoxAction.groupdetailUpdateTemplate,
                controller: "groupDetailUpdateCtrl",
                backdrop: "static",
                resolve: {
                    item: function () {
                        return angular.copy(item);
                    },
                    functions:function(){
                        return $http.get($authoxAction.methodPage+"?pageSize=9999&pageNum1&like=");
                    },
                    haved:function () {
                        return $http.post($authoxAction.groupdetailHaved,{pageSize:9999,pageNum:1,like:{group_id:item.group_id}})

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
.controller("groupEditCtrl",function ($rootScope,$scope,$http,$authoxAction,$uibModalInstance,isNew,edit)
{
    $scope.isNew = isNew;
    if (!$scope.isNew)
    {
        $scope.edit = edit;
    }
    $scope.cancel = function ()
    {
        $uibModalInstance.dismiss("cancel");
    };
    //添加
    $scope.add = function ()
    {
        $http.post($authoxAction.groupAdd, $scope.edit)
            .success(function (result)
            {
                $uibModalInstance.close(true);
                if (result.status == false)
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
    $scope.modify = function ()
    {
        $http.post($authoxAction.groupModify, $scope.edit)
            .success(function (result)
            {
                $uibModalInstance.close(true);
                if (result.status == false)
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
.controller("groupDeleteCtrl",function ($rootScope,$scope,$http,$authoxAction,$uibModalInstance,data)
{
    $scope.data = data;
    $scope.num = $scope.data.length;
    $scope.cancel = function () {
        $uibModalInstance.dismiss("cancel");
    };
    //删除
    $scope.del = function ()
    {
        $http.post($authoxAction.groupDelete, $scope.data)
            .success(function (result)
            {
                $uibModalInstance.close(true);
                if (result.status == false)
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
.controller("groupDetailUpdateCtrl",function ($rootScope,$scope,$http,$authoxAction,$uibModalInstance,item,haved,functions)
{
    //TODO: 优化  外键关联中文展示
    $scope.item=item;
    $scope.haved=haved.data.data;

    $scope.functions=functions.data.data;

    $scope.cancel = function () {
        $uibModalInstance.dismiss("cancel");
    };

    $scope.pop=function (list)
    {
        hl=$scope.haved.length;
        for(i=0; i<hl; i++) {
            if($scope.haved[i].function_id == list.function_id)
            {
                $scope.haved.splice(i, 1);
                //$scope.functions.push(list);
                break;
            }
        }
    }
    $scope.push=function (list)
    {
        $scope.haved.push({
            group_id:$scope.item.group_id,
            function_id:list.function_id,
            function:list.function,
            controller_id:list.controller_id,
            controller:list.controller
        });
    }
    $scope.havfuc=function (fuc)
    {
        length=$scope.haved.length;
        flag=true;
        for(i=0;i<length;i++)
        {
            if(fuc.function_id==$scope.haved[i].function_id)
            {
                flag= false;
                break;
            }
        }
        return flag;
    }

    $scope.update=function ()
    {
        $http.post($authoxAction.groupdetailUpdate,{
            group_id:$scope.item.group_id,
            functions:$scope.haved
        }).success(function (result)
            {
                $uibModalInstance.close(true);
                if(result.status==false)
                {
                    alert(result.message);
                }
            })
    }
})