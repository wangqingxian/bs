/**
 * Created by Administrator on 2017/2/17.
 */
angular.module("userController")
.controller("userModifyCtrl",function ($scope,$http,$userAction,$compile,$checkboxCtr,$state,$stateParams)
{
    $scope.user_id=$stateParams.id||"";
    $scope.res = true;
    $scope.edit = {};
    $http.post($userAction.userDetail,{user_id:$scope.user_id})
        .success(function (result) {
            $scope.edit=result.data;
        })

    $scope.yzm = function () {
        $http.get($userAction.captcha)
            .success(function (result) {
                if (result.status) {
                    ele = $compile($.parseHTML(result.data))($scope);
                    angular.element("#yzm").empty().append(ele);
                }
                else {
                    alert(result.message);
                }
            })
    }
    $scope.yzm();
    $scope.randomString = function (len) {
        len = len || 15;
        var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678~!@#$%^&*';
        /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
        var maxPos = $chars.length;
        var pwd = '';
        for (i = 0; i < len; i++) {
            pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
        }
        $scope.edit.password = pwd;
    }

    $scope.modify = function () {
        $http.post($userAction.userModify, $scope.edit)
            .success(function (result) {
                if (result.status) {
                    alert(result.message);
                    $state.go("user", {}, {reload: true});
                }
                else {
                    alert(result.message);
                }
            })
    }
})