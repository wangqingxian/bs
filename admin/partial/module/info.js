/**
 * Created by Administrator on 2017/2/24.
 */
angular.module("moduleController")
.controller("moduleInfoCtrl",function ($scope,$rootScope,$http,$stateParams,$state,$moduleAction)
{
    if($stateParams.hasOwnProperty('id'))
        $rootScope.moduleModifyCtrlID=$stateParams.id;
    else
        $state.go("module.manage");

    $scope.edit={};
    $http.post($moduleAction.moduleDetail,{module_id:$stateParams.id})
        .success(function (result)
        {
            if(result.status)
            {
                $scope.edit=result.data;
            }
            else
            {
                alert(result.message);
            }
        })

    $scope.next=function ()
    {
        $http.post($moduleAction.moduleModify,$scope.edit)
            .success(function (result)
            {
                if(result.status)
                {
                    $state.go("module.modify.field",{id:$stateParams.id},{reload:true});
                }
                else
                {
                    alert(result.message);
                }
            })
    }

    $scope.cancel=function ()
    {
        $state.go("module.manage",{},{reload:true});
    }
})