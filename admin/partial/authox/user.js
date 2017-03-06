/**
 * Created by Administrator on 2017/2/15.
 */
angular.module("authoxController")
.controller("userAuthoxCtrl",function ($rootScope,$scope,$http,$authoxAction,$checkboxCtr,$uibModal)
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
        $http.post($authoxAction.userPage, $scope.model)
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
            $scope.model.like.fullname=$scope.searchdata;
            $scope.model.like.username=$scope.searchdata;
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

    //更换分组
    $scope.group=function (item,show)
    {
        $scope.checkSingle(item,show);
        var modalInstance = $uibModal.open({
            templateUrl: $authoxAction.usergroupChangeTemplate,
            controller: "userGroupCtrl",
            backdrop: "static",
            resolve: {
                item: function () {
                    return angular.copy(item);
                },
                group:function () {
                    return $http.get($authoxAction.groupPage+"?pageNum=1&pageSize=9999&like=")
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
    //权限修改
    $scope.authox=function (item,show)
    {
        $scope.checkSingle(item,show);
        var modalInstance = $uibModal.open({
            templateUrl: $authoxAction.groupdetailUpdateTemplate,
            controller: "userUpdateCtrl",
            backdrop: "static",
            resolve: {
                item: function () {
                    return angular.copy(item);
                },
                functions:function(){
                    return $http.get($authoxAction.methodPage+"?pageSize=9999&pageNum=1&like=");
                },
                haved:function () {
                    return $http.post($authoxAction.authoxHaved,{pageSize:9999,pageNum:1,like:{user_id:item.user_id}})
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
.controller("userGroupCtrl",function ($rootScope,$scope,$http,$authoxAction,$uibModalInstance,item,group)
{
    $scope.edit = item;
    if($scope.edit.group_id==null)
    {
        $scope.edit.group_id="";
    }
    $scope.group=group.data.data;

    $scope.cancel = function ()
    {
        $uibModalInstance.dismiss("cancel");
    };

    $scope.update = function ()
    {
        $http.post($authoxAction.usergroupChange,{
            user_id:$scope.edit.user_id,
            group_id:$scope.edit.group_id
        }).success(function (result)
            {
                $uibModalInstance.close(true);
                if (result.status == false)
                {
                    alert(result.message);
                }
            })
    }
})
.controller("userUpdateCtrl",function ($rootScope,$scope,$http,$authoxAction,$uibModalInstance,item,haved,functions)
{
    $scope.item = item;
    $scope.haved=haved.data.data;
    $scope.functions=functions.data.data;
    $scope.cancel = function () {
        $uibModalInstance.dismiss("cancel");
    };

    $scope.pop = function (list) {
        hl = $scope.haved.length;
        for (i = 0; i < hl; i++) {
            if ($scope.haved[i].function_id == list.function_id) {
                $scope.haved.splice(i, 1);
                //$scope.functions.push(list);
                break;
            }
        }
    }
    $scope.push = function (list) {
        $scope.haved.push({
            user_id: $scope.item.user_id,
            function_id: list.function_id,
            function: list.function,
            controller_id: list.controller_id,
            controller: list.controller
        });
    }
    $scope.havfuc = function (fuc) {
        length = $scope.haved.length;
        flag = true;
        for (i = 0; i < length; i++) {
            if (fuc.function_id == $scope.haved[i].function_id) {
                flag = false;
                break;
            }
        }
        return flag;
    }

    $scope.update = function () {
        $http.post($authoxAction.authoxUpdate, {
            user_id: $scope.item.user_id,
            functions: $scope.haved
        }).success(function (result) {
            $uibModalInstance.close(true);
            if (result.status == false) {
                alert(result.message);
            }
        })
    }
})