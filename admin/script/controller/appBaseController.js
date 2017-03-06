/**
 * Created by WeiJun_Xaing on 2016/08/30.
 */

angular.module("appBase", [])

    .config(["$httpProvider", function ($httpProvider) {
        if (!$httpProvider.defaults.headers.get) {
            $httpProvider.defaults.headers.get = {};
        }
        // 禁用 IE AJAX 请求缓存
        $httpProvider.defaults.headers.get["If-Modified-Since"] = "Mon, 26 Jul 1997 05:00:00 GMT";
        $httpProvider.defaults.headers.get["Cache-Control"] = "no-cache";
        $httpProvider.defaults.headers.get["Pragma"] = "no-cache";

        //$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

        //HTTP头设置
        $httpProvider.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

        //HTTP请求拦截器
        $httpProvider.interceptors.push("$httpInterceptor");

        // var param = function(obj) {
        //     var query = '', name, value, fullSubName, subName, subValue, innerObj, i;
        //
        //     for(name in obj) {
        //         value = obj[name];
        //
        //         if(value instanceof Array) {
        //             for(i=0; i<value.length; ++i) {
        //                 subValue = value[i];
        //                 fullSubName = name + '[' + i + ']';
        //                 innerObj = {};
        //                 innerObj[fullSubName] = subValue;
        //                 query += param(innerObj) + '&';
        //             }
        //         }
        //         else if(value instanceof Object) {
        //             for(subName in value) {
        //                 subValue = value[subName];
        //                 fullSubName = name + '[' + subName + ']';
        //                 innerObj = {};
        //                 innerObj[fullSubName] = subValue;
        //                 query += param(innerObj) + '&';
        //             }
        //         }
        //         else if(value !== undefined && value !== null)
        //             query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
        //     }
        //
        //     return query.length ? query.substr(0, query.length - 1) : query;
        // };
        //
        // // Override $http service's default transformRequest
        // $httpProvider.defaults.transformRequest = [function(data) {
        //     return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
        // }];
    }])


    /**
     * Number Of Request
     */
    .constant("REQUEST_CNT", 0)

    /**
     * Http Interceptor
     */
    .factory("$httpInterceptor", ["$rootScope", "$q", "REQUEST_CNT", function ($rootScope, $q, REQUEST_CNT) {
        function _requestReduce() {
            REQUEST_CNT--;
            if (0 == REQUEST_CNT) {
                $rootScope.$broadcast("loading.change", [false]);
            }
        }

        return {
            request: function (config) {
                //拦截请求
                REQUEST_CNT++;
                if (!/.*\.(html|css|js)$/ig.test(config.url)) {
                    if (config.url.indexOf("?") != -1) {
                        config.url += "&_=" + new Date().getTime();
                    } else {
                        config.url += "?_=" + new Date().getTime();
                    }
                    $rootScope.$broadcast("loading.change", [true]);
                }
                return config;
            },
            response: function (response) {
                //拦截响应
                _requestReduce();
                return response;
            },
            requestError: function (rejection) {
                //拦截请求异常
                _requestReduce();
                return $q.reject(rejection);
            },
            responseError: function (rejection) {
                //拦截响应异常
                _requestReduce();

                return $q.reject(rejection);
            }
        };
    }])
    /**
     * WebSocket
     */
    .factory("$webSocket", ["$log", function ($log) {
        return {
            init: function (url, onmessage, nowork) {
                if (typeof WebSocket !== "undefined") {
                    var ws = new WebSocket(url);

                    //监听Socket的打开
                    ws.onopen = function (event) {
                        $log.info("【" + url + "】 WebSocket Open.");
                    };

                    //监听错误
                    ws.onerror = function () {
                        $log.info("WebSocket Error.");
                    };

                    //监听消息
                    ws.onmessage = function (event) {
                        if (typeof onmessage !== "undefined") {
                            onmessage(event);
                        }
                    };

                    //监听Socket的关闭
                    ws.onclose = function () {
                        $log.info("WebSocket Closed.");
                    };

                } else {
                    $log.warn("Sorry, Your Browser Does Not Support WebSocket.");
                    if (typeof nowork !== "undefined") {
                        nowork();
                    }
                }
            }
        };
    }])

    /**
     * Checkbox Controller
     */
    .factory("$checkboxCtr", function () {
        return {
            checkSingle: function (data, datas, $event) {
                //单选
                var allChecked = true;

                if (typeof $event !== "undefined") {
                    $event.stopPropagation();
                }

                data.checked = !data.checked;

                for (var i = 0; i < datas.length; i++) {
                    if (!datas[i].checked) {
                        allChecked = false;
                        break;
                    }
                }

                return allChecked;
            },
            checkAll: function (state, datas, $event) {
                //全选
                if (typeof $event !== "undefined") {
                    $event.stopPropagation();
                }

                state = !state;

                angular.forEach(datas, function (value, key) {
                    value.checked = state;
                });

                return state;
            }
        };
    })

    .controller("apiController",function ($scope,$rootScope,$http,$uibModal,$checkboxCtr,$state,$stateParams)
    {
        //查询条件
        $scope.model = {
            pageNum: 1,
            pageSize: 10,
            select: [],
            like: {}
        }
        //获取数据
        $scope.getdata = function ()
        {
            $http.post($scope.module.page, $scope.model)
                .success(function (result)
                {
                    if (result.status == "true" || result.status == true)
                    {
                        $scope.data = result;
                        $scope.show = result.data;
                        $scope.dataSize = result.dataSize;
                    }
                    else
                    {
                        $scope.data = {};
                        $scope.show = [];
                        $scope.dataSize = 0;
                        alert(result.message);
                    }
                })
                .error(function ()
                {
                    alert("服务器链接失败！");
                    $scope.data = {};
                    $scope.show = [];
                    $scope.dataSize = 0;
                })
        }
        $scope.getdata();

        //换页
        $scope.changePage = function ()
        {
            $scope.getdata();
        }
        //表格双击单选
        $scope.checkSingle = function (data, datas, $event)
        {
            $scope.allChecked = $checkboxCtr.checkSingle(data, datas, $event);
        };
        //全选功能
        $scope.checkAll = function (state, datas, $event)
        {
            $scope.allChecked = $checkboxCtr.checkAll(state, datas, $event);
        };
        //获取当前选中的数据
        $scope.getselect = function ()
        {
            var select = [];
            angular.forEach($scope.show, function (value, key, array) {
                if (value.checked) {
                    this.push(value);
                }
            }, select)
            return select;
        }

        $scope.back=function ()
        {
            $state.go("module.manage",{},{reload:true});
        }

        $scope.add = function ()
        {
            $state.go("module.api_add");
        }

        $scope.modify=function (item,show)
        {
            $state.go("module.api_modify",{module:item});
        }

        $scope.delete = function ()
        {
            del=$scope.getselect();
            if (del.length =1)
            {
                var modalInstance = $uibModal.open({
                    templateUrl: "admin/partial/user/delete.html",
                    controller: "apiDelete",
                    backdrop: "static",
                    resolve: {
                        data: function () {
                            return angular.copy(del);
                        },
                        moduleApi:function ()
                        {
                            return angular.copy($scope.module);
                        }
                    }
                });
                modalInstance
                    .result.then(function () {
                    $scope.getdata();
                }, function () {
                });
            }
        }

    })

    .controller("apiDelete",function ($scope,$http,moduleApi,data,$uibModalInstance)
    {
        $scope.data = data;
        $scope.num = $scope.data.length;
        $scope.cancel = function ()
        {
            $uibModalInstance.dismiss("cancel");
        };
        //删除
        $scope.del = function ()
        {
            $http.post(moduleApi.delete, $scope.data)
                .success(function (result)
                {
                    $uibModalInstance.close(true);
                    if (result.status == false)
                    {
                        alert(result.message);
                    }
                })
                .error(function ()
                {
                    alert("服务器链接失败！");
                    $scope.cancel();
                });
        }
    })
