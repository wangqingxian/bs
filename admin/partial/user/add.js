/**
 * Created by Administrator on 2017/2/17.
 */
angular.module("userController")
.controller("userAddCtrl",function ($scope,$http,$userAction,$compile,$checkboxCtr,$state)
{
    $scope.res=true;
    $scope.edit={};
    $http.post($userAction.groupPage,{pageNum:1,pageSize:9999,like:[]})
        .success(function (result)
        {
            $scope.groups=result.data;
        })
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
        $http.post($userAction.userAdd,$scope.edit)
            .success(function (result)
            {
                if(result.status)
                {
                    alert(result.message);
                    $state.go("user.add",{},{reload:true});
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