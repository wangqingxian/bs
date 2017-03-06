/**
 * Created by Administrator on 2017/2/9.
 */
var app=angular.module("ac",[]);


app.controller("login",function ($scope,$http)
{
    $scope.login=function ()
    {
        $http.post("login/check",{username:$scope.username,password:$scope.password})
            .success(function (result)
            {
                $scope.message=result.message;
                if(result.status)
                {
                    window.location.href="manage#/"
                }
            })
    }
})
