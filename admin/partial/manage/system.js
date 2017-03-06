/**
 * Created by Administrator on 2017/3/2.
 */
angular.module("manageController")
.controller("manageSystemCtrl",function ($scope,$manageAction,$http)
{
    $http.get($manageAction.system)
        .success(function (result)
        {
            $scope.system=result.data;
        })
})