/**
 * Created by Administrator on 2017/2/20.
 */
angular.module("moduleController")
.controller("moduleManageCtrl",function ($rootScope,$scope,$http,$moduleAction,$checkboxCtr,$uibModal,$state,$stateParams)
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
        $http.post($moduleAction.modulePage, $scope.model)
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
            $scope.model.like.module_name = $scope.searchdata;

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

    $scope.add = function ()
    {
        $state.go("module.add");
    }

    $scope.database=function (item,show)
    {
        $state.go("module.api",{module:item.module_id})
    }

    $scope.delete = function (del)
    {
        if (del.length =1) {
            var modalInstance = $uibModal.open({
                templateUrl: $moduleAction.deleteTemplate,
                controller: "moduleDeleteCtrl",
                backdrop: "static",
                resolve: {
                    data: function () {
                        return angular.copy(del);
                    }
                }
            });
            modalInstance
                .result.then(function () {
                $scope.getdata();
                $scope.allChecked=false;
                $scope.refresh();
            }, function () {
            });
        }
        else if (del.length>1)
        {
            alert("同时只能删除一条数据！");
        }
    }

    $scope.available = function (item, available, show)
    {
        $scope.checkSingle(item, show);
        $http.post($moduleAction.moduleAvailable, {module_id: item.module_id, available: available})
            .success(function (result) {
                if (result.status) {
                    item.available = available;
                }
                else {
                    alert(result.message);
                }
            })
            .error(function () {
                alert("服务器链接失败！");
            });
    }

    $scope.left=function (item,is_left,show)
    {
        $scope.checkSingle(item, show);
        $http.post($moduleAction.moduleLeft,{"module_id":item.module_id,"is_left":is_left})
            .success(function (result)
            {
                if(result.status)
                {
                    $scope.getdata();
                    $scope.refresh();
                }
                else
                {
                    alert(result.message);
                }
            })
    }

    $scope.refresh=function ()
    {
        $http.get($moduleAction.moduleMenu)
            .success(function (result)
            {
                if(result.status)
                {
                    $rootScope.tree = [
                        {
                            "module_id": 1,
                            "module_name": "API管理",
                            "module_sref": "module.manage",
                            "nodes": result.data
                        }
                    ]
                }
                else
                {
                    $rootScope.tree = [
                        {
                            "module_id": 1,
                            "module_name": "API管理",
                            "module_sref": "module.manage",
                            "nodes": []
                        }
                    ]
                    alert(result.message);
                }
            })
    }

    $scope.modify=function (item,show)
    {
        $state.go("module.modify.info",{id:item.module_id});
    }
})
.controller("moduleDeleteCtrl",function ($rootScope,$scope,$http,$moduleAction,$uibModalInstance,data)
{
    $scope.data = data;
    $scope.num = $scope.data.length;
    $scope.cancel = function () {
        $uibModalInstance.dismiss("cancel");
    };
    //删除
    $scope.del = function () {
        $http.post($moduleAction.moduleDelete, $scope.data)
            .success(function (result) {
                $uibModalInstance.close(true);
                if (result.status == false) {
                    alert(result.message);
                }
            })
            .error(function () {
                alert("服务器链接失败！");
                $scope.cancel();
            });
    }
})
