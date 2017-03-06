/**
 * Created by Administrator on 2017/2/14.
 */
angular.module("authoxController")
.controller("methodCtrl",function ($rootScope,$scope,$http,$authoxAction,$checkboxCtr,$uibModal)
{
        //查询条件
        $scope.model = {
            pageNum: 1,
            pageSize: 10,
            select: [],
            like: {}
        }
        $scope.searchdata = ["", ""];
        //获取数据
        $scope.getdata = function ()
        {
            $http.post($authoxAction.methodPage, $scope.model)
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
            if ($scope.searchdata[0] != "" || $scope.searchdata[1] != "")
            {
                $scope.model.pageNum = 1;
                reg = /[\u4e00-\u9fa5]/;
                if (reg.test($scope.searchdata[0]))
                {
                    $scope.model.like.function_name = $scope.searchdata[0];
                }
                else
                {
                    $scope.model.like.function = $scope.searchdata[0];
                }
                if ($scope.searchdata[1] != "")
                {
                    $scope.model.like.controller = $scope.searchdata[1];
                }
                $scope.getdata();
            }
        }
        //清除查询条件
        $scope.clear = function ()
        {
            $scope.searchdata = ["", ""];
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
            angular.forEach($scope.show, function (value, key, array)
            {
                if (value.checked)
                {
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
                    controller: "methodDeleteCtrl",
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
                templateUrl: $authoxAction.methodEditTemplate,
                controller: "methodEditCtrl",
                backdrop: "static",
                resolve: {
                    isNew: function () {
                        return true;
                    },
                    edit: function () {
                        return "";
                    },
                    controller:function ()
                    {
                        return $http.post($authoxAction.controllerPage,{pageSize:9999,pageNum:1,like:[]})
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
            if (mod.length > 1) {
                alert("一次只能修改一条！");
            }
            else if (mod.length == 1)
            {
                var modalInstance = $uibModal.open({
                    templateUrl: $authoxAction.methodEditTemplate,
                    controller: "methodEditCtrl",
                    backdrop: "static",
                    resolve: {
                        isNew: function () {
                            return false;
                        },
                        edit: function () {
                            return angular.copy(mod[0]);
                        },
                        controller:function ()
                        {
                            return $http.post($authoxAction.controllerPage,{pageSize:9999,pageNum:1,like:[]})
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
    })
.controller("methodEditCtrl",function ($rootScope,$scope,$http,$authoxAction,$uibModalInstance,isNew,edit,controller)
{
        $scope.isNew = isNew;
        $scope.controller=controller.data.data;
        if (!$scope.isNew)
        {
            $scope.edit = edit;
        }
        $scope.cancel = function ()
        {
            $uibModalInstance.dismiss("cancel");
        };
        $scope.select=function ()
        {
            angular.forEach($scope.controller,function (value,key,array)
            {
                if(value.controller_id==$scope.edit.controller_id)
                {
                    $scope.edit.controller=value.controller;
                }
            })
        }
        //添加
        $scope.add = function ()
        {
            $http.post($authoxAction.methodAdd, $scope.edit)
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
            $http.post($authoxAction.methodModify, $scope.edit)
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
.controller("methodDeleteCtrl",function ($rootScope,$scope,$http,$authoxAction,$uibModalInstance,data)
{
        $scope.data = data;
        $scope.num = $scope.data.length;
        $scope.cancel = function ()
        {
            $uibModalInstance.dismiss("cancel");
        };
        //删除
        $scope.del = function ()
        {
            $http.post($authoxAction.methodDelete, $scope.data)
                .success(function (result)
                {
                    $uibModalInstance.close(true);
                    if (result.status == false) {
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