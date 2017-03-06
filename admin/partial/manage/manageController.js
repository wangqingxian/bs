/**
 * Created by Administrator on 2017/2/9.
 */
angular.module("manageController")
.value("$manageAction",{
    "system":"manage/system",
    "dash":"manage/dash"
})
.controller("homeCtrl",function ($rootScope,$scope,$http,$manageAction)
{
    $scope.tree2=[
        {
            "id": 1,
            "title": "系统监控",
            "sref":"index.system",
            "nodes": [
                {
                    "id": 1.1,
                    "title": "系统信息",
                    "sref":"index.system",
                    "nodes":[]
                },
                {
                    "id":1.2,
                    "title":"使用情况",
                    "sref":"index.dash",
                    "nodes":[]
                }
            ]
        },

    ]
})
