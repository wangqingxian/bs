/**
 * Created by Administrator on 2017/2/15.
 */

angular.module("userController")
.value("$userAction",{
    deleteTemplate: "admin/partial/user/delete.html",
    userPage: "user/page",
    userAdd:"user/add",
    userDelete:"user/delete",
    userModify: "user/modify",
    userlock:"user/lock",
    userDetail:"user/detail",
    paschange:"user/paschange",
    quickadd:"user/register",
    quickaddTemplate:"admin/partial/user/quickadd.html",
    captcha:"captcha",
    groupPage:"group/page",
})
.controller("userCtrl",function ($rootScope,$scope,$http,$userAction) {
    $scope.tree = [
        {
            "id": 1,
            "title": "用户管理",
            "sref": "user.manage",
            "nodes": [
                {
                    "id": "1.1",
                    "title": "添加用户",
                    "sref": "user.add",
                    "nodes": []
                },
                {
                    "id": "1.2",
                    "title": "修改用户",
                    "sref": "user.modify",
                },
                {
                    "id": "1.3",
                    "title": "修改密码",
                    "sref": "user.password"
                }
            ]
        },
    ]
})