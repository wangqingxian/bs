/**
 * Created by Administrator on 2017/2/20.
 */
angular.module("moduleController")
.value("$moduleAction",{
    deleteTemplate: "admin/partial/user/delete.html",
    moduleMenu:"module/menu",
    modulePage:"module/page",
    moduleCreate:"module/create",
    moduleLeft:"module/left",
    moduleAvailable:"module/available",
    moduleAdd:"module/add",
    moduleDetail:"module/detail",
    moduleInfo:"module/info",
    moduleLast:"module/last",
    moduleDelete:"module/delete",
    moduleModify:"module/modify",
    moduleAddFieldTemplate:"admin/partial/module/addField.html",
    moduleAddField:"module/add_field",
    moduleDeleteFieldTemplate:"admin/partial/module/deleteField.html",
    moduleDeleteField:"module/delete_field",
    moduleModifyFieldTemplate:"admin/partial/module/modifyField.html",
    moduleModifyField:"module/modify_field",
    moduleInit:"module/init"
})
.controller("moduleCtrl",function ($rootScope,$scope,$http,$moduleAction)
{
    $http.get($moduleAction.moduleMenu)
        .success(function (result)
        {
            if(result.status)
            {
                $rootScope.tree = [
                    {
                        "module_id": 1,
                        "module_name": "API管理",
                        "module_sref": "module.manage",
                        "nodes": result.data
                    }
                ]
            }
            else
            {
                $rootScope.tree = [
                    {
                        "module_id": 1,
                        "module_name": "API管理",
                        "module_sref": "module.manage",
                        "nodes": []
                    }
                ]
                alert(result.message);
            }
        })
})