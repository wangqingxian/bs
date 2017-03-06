/**
 * Created by Administrator on 2017/2/21.
 */
angular.module("moduleController")
.controller("moduleAddCtrl",function ($scope,$http,$moduleAction,$compile,$checkboxCtr,$state)
{
    $scope.edit = {
        is_left:"",
        available:""
    };
    $scope.add=function ()
    {
        $scope.edit.is_left=($scope.edit.is_left=='1');
        $scope.edit.available=($scope.edit.available=='1');
        $http.post($moduleAction.moduleAdd,$scope.edit)
            .success(function (result)
            {
                if(result.status)
                {
                    $state.go("module.create",{id:result.data.module_id})
                }
                else
                {
                    alert(result.message);
                }
            })
    }

    $scope.cancel=function ()
    {
        $state.go('module.manage')
    }
})