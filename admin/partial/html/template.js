/**
 * Created by Administrator on 2017/3/9.
 */
angular.module("htmlController")
.controller("templateManageCtrl",function ($rootScope,$scope,$http,$htmlAction,$checkboxCtr,$uibModal,$state,$stateParams)
{
    $scope.searchdata = "";
    //获取数据
    $scope.getdata = function ()
    {
        $http.get($htmlAction.templateAll)
            .success(function (result)
            {
                if (result.status == "true" || result.status == true)
                {
                    $scope.data = result;
                    $scope.show = result.data;

                }
                else
                {
                    $scope.data = {};
                    $scope.show = [];
                    alert(result.message);
                }
            })
            .error(function ()
            {
                alert("服务器链接失败！");
                $scope.data = {};
                $scope.show = [];
            })
    }
    $scope.getdata();

    //清除查询条件
    $scope.clear = function ()
    {
        $scope.searchdata = "";
        $scope.getdata();
    }
    //表格双击单选
    $scope.checkSingle = function (data, datas, $event) {
        $scope.allChecked = $checkboxCtr.checkSingle(data, datas, $event);
    };
    //全选功能
    $scope.checkAll = function (state, datas, $event) {
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
        }, select);
        return select;
    }

    $scope.select = function (item, show)
    {
        if (item.checked)
        {
            item.checked = false;
        }
        else
        {
            l = show.length;
            for (i = 0; i < l; i++)
            {
                show[i].checked = false;
            }
            item.checked = true;
        }
    }

    $scope.template = function ()
    {
        var modalInstance = $uibModal.open({
            templateUrl: $htmlAction.templateAddModal,
            controller: "htmlTemplateCtrl",
            backdrop: "static",
            resolve: {}
        });
        modalInstance
            .result.then(function ()
            {
                $scope.getdata();
            },
            function ()
            {

            });
    }


    $scope.delete = function ()
    {
        del = $scope.getselect();
        if (del.length = 1)
        {
            var modalInstance = $uibModal.open({
                templateUrl: $htmlAction.templateDeleteModal,
                controller: "htmlTemplateDeleteCtrl",
                backdrop: "static",
                resolve: {
                    data: function ()
                    {
                        return angular.copy(del[0]);
                    }
                }
            });
            modalInstance
                .result.then(function ()
                {
                    $scope.getdata();
                },
                function ()
                {

                });
        }
        else if (del.length > 1)
        {
            alert("同时只能删除一条数据！");
        }
    }


    $scope.modify = function ()
    {
        modify = $scope.getselect();
        if (modify.length = 1)
        {
            var modalInstance = $uibModal.open({
                templateUrl: $htmlAction.templateModifyModal,
                controller: "htmlTemplateModifyCtrl",
                backdrop: "static",
                resolve: {
                    data: function ()
                    {
                        return angular.copy(modify);
                    }
                }
            });
            modalInstance
                .result.then(function ()
                {
                    $scope.getdata();
                },
                function ()
                {

                });
        }
        else if (del.length > 1)
        {
            alert("同时只能删除一条数据！");
        }
    }

    $scope.edit=function ()
    {
        let edit= $scope.getselect();
        if(edit.length==1)
        {
            let url="html/edit/"+edit[0].basename;
            let el = document.createElement("a");
            document.body.appendChild(el);
            el.href = url; //url 是你得到的连接
            el.target = '_new'; //指定在新窗口打开
            el.click();
            document.body.removeChild(el);
        }
        else if(edit.length>1)
            alert("同时只能选择一个模版")
    }

})
.controller("htmlTemplateCtrl",function ($rootScope,$scope,$http,$htmlAction,$uibModalInstance)
{
    $scope.newtem = true;

    $scope.edit = {
        name: "",
    }

    $scope.cancel = function () {
        $uibModalInstance.dismiss("cancel");
    };

    $scope.add = function ()
    {
        $http.post($htmlAction.templateAdd, $scope.edit)
            .success(function (result) {
                if (result.status == false) {
                    alert(result.message);
                }
                else {
                    $uibModalInstance.close(true);
                }
            })
            .error(function () {
                alert("服务器链接失败！");
                $scope.cancel();
            });
    }
})
.controller("htmlTemplateDeleteCtrl",function ($scope,$rootScope,$htmlAction,data,$uibModalInstance,$http)
{
    $scope.data = data;

    $scope.cancel = function () {
        $uibModalInstance.dismiss("cancel");
    };

    $scope.del = function () {
        $http.post($htmlAction.templateDelete, $scope.data)
            .success(function (result) {
                if (result.status == false) {
                    alert(result.message);
                }
                else {
                    $uibModalInstance.close(true);
                }
            })
            .error(function () {
                alert("服务器链接失败！");
                $scope.cancel();
            });
    }
})
.controller("htmlTemplateModifyCtrl",function ($scope,$rootScope,$htmlAction,data,$uibModalInstance,$http)
{
    $scope.edit = data[0];
    $scope.newtem = false;

    $scope.edit.new = angular.copy($scope.edit.filename);
    $scope.cancel = function () {
        $uibModalInstance.dismiss("cancel");
    };

    $scope.modify = function () {
        $http.post($htmlAction.templateModify, $scope.edit)
            .success(function (result) {
                if (result.status == false) {
                    alert(result.message);
                }
                else {
                    $uibModalInstance.close(true);
                }
            })
            .error(function () {
                alert("服务器链接失败！");
                $scope.cancel();
            });
    }
})

