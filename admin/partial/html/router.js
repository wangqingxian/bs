/**
 * Created by Administrator on 2017/3/8.
 */
angular.module("htmlController")
.controller("htmlManageCtrl",function ($rootScope,$scope,$http,$htmlAction,$checkboxCtr,$uibModal,$state,$stateParams)
{
    $scope.searchdata = "";
    //获取数据
    $scope.getdata = function ()
    {
        $http.get($htmlAction.routerItems)
            .success(function (result)
            {
                if (result.status == "true" || result.status == true)
                {
                    $scope.data = result;
                    $scope.show = result.data;

                }
                else {
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
        let select = [];
        angular.forEach($scope.show, function (value, key, array) {
            if (value.checked) {
                this.push(value);
            }
        }, select)
        return select;
    }

    $scope.select=function (item,show)
    {
        if(item.checked)
        {
            item.checked=false;
        }
        else
        {
            let l=show.length;
            for(let i=0;i<l;i++)
            {
                show[i].checked=false;
            }
            item.checked=true;
        }
    }

    $scope.router = function ()
    {
        let modalInstance = $uibModal.open({
            templateUrl: $htmlAction.routerAddTemplate,
            controller: "htmlRouterCtrl",
            backdrop: "static",
            resolve: {
                template:function ($http)
                {
                    return $http.get($htmlAction.routerTemplate);
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


    $scope.delete = function ()
    {
        let del=$scope.getselect();
        if (del.length = 1)
        {
            var modalInstance = $uibModal.open({
                templateUrl: $htmlAction.deleteTemplate,
                controller: "htmlRouterDeleteCtrl",
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
            }, function () {
            });
        }
        else if (del.length > 1)
        {
            alert("同时只能删除一条数据！");
        }
    }


    $scope.modify = function ()
    {
        let modify=$scope.getselect();
        if (modify.length = 1)
        {
            let modalInstance = $uibModal.open({
                templateUrl: $htmlAction.modifyTemplate,
                controller: "htmlRouterModifyCtrl",
                backdrop: "static",
                resolve: {
                    data: function () {
                        return angular.copy(modify);
                    },
                    template:function ($http)
                    {
                        return $http.get($htmlAction.routerTemplate);
                    }
                }
            });
            modalInstance
                .result.then(function () {
                $scope.getdata();
            }, function () {
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
            let url="html/edit/"+edit[0].template+".html";
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
.controller("htmlRouterCtrl",function ($rootScope,$scope,$http,$htmlAction,$uibModalInstance,template)
{
    $scope.newtem=true;
    $scope.template=template.data.data;
    $scope.edit={
        url:[""],
        name:"",
        template:""
    }

    $scope.newt=function ()
    {
        $scope.edit.template="";
        $scope.newtem=true;
    }

    $scope.oldt=function ()
    {
        $scope.edit.template="";
        $scope.newtem=false;
    }

    $scope.addUrl=function (index)
    {
        console.log($scope.edit);
        $scope.edit.url.splice(index+1,0,"");
    }

    $scope.delUrl=function (index)
    {
        if($scope.edit.url.length>0)
            $scope.edit.url.splice(index, 1);
    }
    $scope.cancel = function () {
        $uibModalInstance.dismiss("cancel");
    };
    //删除
    $scope.add = function ()
    {
        $http.post($htmlAction.routerAdd, $scope.edit)
            .success(function (result)
            {
                if (result.status == false)
                {
                    alert(result.message);
                }
                else
                {
                    $uibModalInstance.close(true);
                }
            })
            .error(function ()
            {
                alert("服务器链接失败！");
                $scope.cancel();
            });
    }
})
.controller("htmlRouterDeleteCtrl",function ($scope,$rootScope,$htmlAction,data,$uibModalInstance,$http)
{
    $scope.data=data;
    $scope.data[0].real="false";
    $scope.cancel = function () {
        $uibModalInstance.dismiss("cancel");
    };

    $scope.del=function ()
    {
        $http.post($htmlAction.routerDelete,$scope.data[0])
            .success(function (result)
            {
                if (result.status == false)
                {
                    alert(result.message);
                }
                else
                {
                    $uibModalInstance.close(true);
                }
            })
            .error(function ()
            {
                alert("服务器链接失败！");
                $scope.cancel();
            });
    }
})
.controller("htmlRouterModifyCtrl",function ($scope,$rootScope,$htmlAction,data,$uibModalInstance,$http,template)
{
    $scope.edit = data[0];
    $scope.newtem=false;
    $scope.template=template.data.data;
    $scope.edit.url=$scope.edit.url.split("/");
    $scope.edit.url.splice(0,1);
    $scope.edit.new=angular.copy($scope.edit.name);
    $scope.cancel = function () {
        $uibModalInstance.dismiss("cancel");
    };
    $scope.newt=function ()
    {
        $scope.edit.template="";
        $scope.newtem=true;
    }

    $scope.oldt=function ()
    {
        $scope.edit.template="";
        $scope.newtem=false;
    }

    $scope.addUrl=function (index)
    {
        console.log($scope.edit);
        $scope.edit.url.splice(index+1,0,"");
    }

    $scope.delUrl=function (index)
    {
        if($scope.edit.url.length>0)
            $scope.edit.url.splice(index, 1);
    }
    $scope.modify = function ()
    {
        $http.post($htmlAction.routerModify, $scope.edit)
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
