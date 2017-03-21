/**
 * Created by Administrator on 2017/3/7.
 */
angular.module("htmlController")
.value("$htmlAction",{
    "routerItems":"router/items",
    "routerAdd":"router/add",
    "routerTemplate":"router/template",
    "routerAddTemplate":"admin/partial/html/routerAdd.html",
    "deleteTemplate":"admin/partial/html/routerDel.html",
    "routerDelete":"router/delete",
    "routerModify":"router/modify",
    "modifyTemplate":"admin/partial/html/routerModify.html",
    "templateAll":"template/all",
    "templateAdd":"template/add",
    "templateDelete":"template/delete",
    "templateModify":"template/modify",
    "templateAddModal":"admin/partial/html/templateAdd.html",
    "templateDeleteModal":"admin/partial/html/templateDelete.html",
    "templateModifyModal":"admin/partial/html/templateModify.html",
})
.controller("htmlCtrl",function ($scope,$rootScope,$http)
{
    $scope.tree2=[
        {
            "id": 1,
            "title": "前端制作",
            "sref":"html.router",
            "nodes": [
                {
                    "id": 1.1,
                    "title": "路由配置",
                    "sref":"html.router",
                    "nodes":[]
                },
                {
                    "id":"1.2",
                    "title":"模版管理",
                    "sref":"html.template",
                    "nodes":[]
                }
            ]
        },

    ]
})