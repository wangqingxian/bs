/**
 * Created by Administrator on 2017/2/16.
 */
angular.module("userController")
.controller("userManageCtrl",function ($rootScope,$scope,$http,$userAction,$checkboxCtr,$uibModal,$state,$stateParams)
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
        $http.post($userAction.userPage, $scope.model)
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

    $scope.add=function ()
    {
        $state.go("user.add");
    }

    $scope.quickadd=function ()
    {
        //帐号密码用户分组 弹窗
        var modalInstance=$uibModal.open({
            templateUrl:$userAction.quickaddTemplate,
            controller:"quickAddCtrl",
            backdrop : "static",
            resolve:{
                groups:function ($http) {
                    return $http.post($userAction.groupPage,{pageNum:1,pageSize:9999,like:[]});
                }
            }
        });
        modalInstance
            .result.then(function ()
            {
                $scope.getdata();
            },function(){});
    }

    $scope.delete=function ()
    {
        //删除 弹窗
        del=$scope.getselect();
        if(del.length>0)
        {
            var modalInstance=$uibModal.open({
                templateUrl:$userAction.deleteTemplate,
                controller:"userDeleteCtrl",
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

    $scope.lock=function (item,is_lock,show)
    {
        $scope.checkSingle(item,show);
        $http.post($userAction.userlock,{user_id:item.user_id,is_lock:is_lock})
            .success(function (result)
            {
                if(result.status)
                {
                    item.is_lock=is_lock;
                }
                else
                {
                    alert(result.message);
                }
            })
            .error(function ()
            {
                alert("服务器链接失败！");
            });
    }

    $scope.detail=function ()
    {
        detail=$scope.getselect();

        if(detail.length>1)
        {
            alert("一次只能修改一条")
        }
        else  if(detail.length==1)
        {
            $state.go("user.modify",{id:detail[0].user_id});
        }
    }

    $scope.password=function ()
    {
        password=$scope.getselect();

        if(password.length>1)
        {
            alert("一次只能修改一条")
        }
        else  if(password.length==1)
        {
            $state.go("user.password",{id:password[0].user_id,username:password[0].username});
        }
    }
})
.controller("userDeleteCtrl",function ($rootScope,$scope,$http,$userAction,$uibModalInstance,data)
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
        $http.post($userAction.userDelete, $scope.data)
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
.controller("quickAddCtrl",function ($rootScope,$scope,$http,$userAction,$uibModalInstance,$compile,groups)
{
    $scope.isNew=true;
    $scope.edit={};
    $scope.groups=groups.data.data;


    $scope.yzm=function ()
    {
        $http.get($userAction.captcha)
            .success(function (result)
            {
               if(result.status)
               {
                   ele=$compile($.parseHTML(result.data))($scope);
                   angular.element("#yzm").empty().append(ele);
               }
               else
               {
                   alert(result.message);
               }
            })
    }
    $scope.yzm();
    $scope.cancel = function ()
    {
        $uibModalInstance.dismiss("cancel");
    };

    $scope.randomString=function(len)
    {
        len = len || 15;
        var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678~!@#$%^&*';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
        var maxPos = $chars.length;
        var pwd = '';
        for (i = 0; i < len; i++) {
            pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
        }
        $scope.edit.password=pwd;
    }

    $scope.register=function ()
    {
        $http.post($userAction.quickadd,$scope.edit)
            .success(function (result)
            {
                if(result.status)
                {
                    $uibModalInstance.close(true);
                }
                else
                {
                    alert(result.message);
                    if(result.message=="验证码错误")
                    {
                        $scope.yzm();
                    }
                }
            })
    }
})