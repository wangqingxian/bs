angular.module('angular-cgs-utils', [])
.directive("ipv4", function () {
    return {
        require: "ngModel",
        link: function (scope, element, attrs, ngModel) {
            var ipv4 = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
            if (!ngModel) {
                return false;
            }
            ngModel.$parsers.unshift(function (viewValue) {
                if (ipv4.test(viewValue)) {
                    //匹配
                    ngModel.$setValidity("ipv4", true);
                }
                else {
                    ngModel.$setValidity("ipv4", false);
                }
                return viewValue;
            });
        }
    };
})
.directive("qq", function () {
    return {
        require: "ngModel",
        link: function (scope, element, attrs, ngModel) {
            var qq = /^\d{5,}$/;
            if (!ngModel) {
                return false;
            }
            ngModel.$parsers.unshift(function (viewValue) {
                if (qq.test(viewValue)) {
                    //匹配
                    ngModel.$setValidity("qq", true);
                }
                else {
                    if (viewValue != "")
                        ngModel.$setValidity("qq", false);
                    else
                        ngModel.$setValidity("qq", true);
                }
                return viewValue;
            });
        }
    };
})
.directive("email", function () {
    return {
        require: "ngModel",
        link: function (scope, element, attrs, ngModel) {
            var email = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
            if (!ngModel) {
                return false;
            }
            ngModel.$parsers.unshift(function (viewValue) {
                if (email.test(viewValue)) {
                    //匹配
                    ngModel.$setValidity("email", true);
                }
                else {
                    if (viewValue != "")
                        ngModel.$setValidity("email", false);
                    else
                        ngModel.$setValidity("email", true);
                }
                return viewValue;
            });
        }
    };
})
.directive("port", function () {
    return {
        require: "ngModel",
        link: function (scope, element, attrs, ngModel) {
            var port = /^[1-9]$|(^[1-9][0-9]$)|(^[1-9][0-9][0-9]$)|(^[1-9][0-9][0-9][0-9]$)|(^[1-6][0-5][0-5][0-3][0-5]$)/;
            if (!ngModel) {
                return false;
            }
            ngModel.$parsers.unshift(function (viewValue) {
                console.log(viewValue);
                if (viewValue == "") {
                    ngModel.$setValidity("port", true);
                }
                else if (port.test(viewValue)) {
                    //匹配
                    ngModel.$setValidity("port", true);
                } else {
                    ngModel.$setValidity("port", false);
                }
                return viewValue;
            });
        }
    };
})
.directive("nochinese", function () {
    return {
        require: "ngModel",
        link: function (scope, element, attrs, ngModel) {
            var re = /[\u4e00-\u9fa5]/;
            if (!ngModel) {
                return false;
            }
            ngModel.$parsers.unshift(function (viewValue) {
                if (re.test(viewValue)) {
                    //匹配
                    ngModel.$setValidity("nochinese", false);
                } else {
                    ngModel.$setValidity("nochinese", true);
                }
                return viewValue;
            });
        }
    };
})
.directive("register", function () {
    return {
        require: "ngModel",
        link: function (scope, element, attrs, ngModel) {
            var re = /^([A-Z]|[a-z]|[0-9]|[~!@#$%^&*]){5,15}$/;
            //	/((?=.*[a-zA-Z])(?=.*\d)|(?=[a-zA-Z])(?=.*[#@!~%^&*])|(?=.*\d)(?=.*[#@!~%^&*]))[a-zA-Z\d#@!~%^&*]{5,15}/i;
            if (!ngModel) {
                return false;
            }
            ngModel.$parsers.unshift(function (viewValue) {
                if (re.test(viewValue)) {
                    //匹配
                    ngModel.$setValidity("register", true);
                } else {
                    ngModel.$setValidity("register", false);
                }
                return viewValue;
            });
        }
    };
})
.directive("telphone", function () {
    return {
        require: "ngModel",
        link: function (scope, element, attrs, ngModel) {
            if (!ngModel) {
                return false;
            }
            ngModel.$parsers.unshift(function (viewValue) {
                if (/^1[0123456789]\d{9}$/.test(viewValue)) {
                    ngModel.$setValidity("telphone", true);
                } else {
                    ngModel.$setValidity("telphone", false);
                }
                return viewValue;
            });
        }
    };
})
.directive("threshold", function () {
    return {
        require: "ngModel",
        link: function (scope, element, attrs, ngModel) {
            if (!ngModel) {
                return false;
            }
            ngModel.$parsers.unshift(function (viewValue) {
                if (/^[0-9]*[1-9][0-9]*$/.test(viewValue)) {
                    ngModel.$setValidity("threshold", true);
                } else {
                    ngModel.$setValidity("threshold", false);
                }
                return viewValue;
            });
        }
    };
})
.directive('toggleUl', function () {
    return {
        link: function (scope, element, attrs) {

            element.click(function () {
                $('.htran-accordin dt').removeClass('active');
                //$('.htran-accordin ul').css('display','none');
                $('.htran-accordin ul').slideUp(300);
                if ($(this).next("ul").css('display') == 'none') {
                    $(this).next("ul").slideDown(300);
                    $(this).addClass('active');
                }
            });
        }
    }
})
.directive('cgsEcharts', function () {
    return {
        require: '?ngModel',
        restrict: 'E',
        scope: {
            option: '='
        },
        link: function (scope, element, attrs, ngModel) {
            require.config({
                paths: {
                    echarts: 'plugin/echarts'
                }
            });
            require(
                [
                    'echarts',
                    'echarts/chart/line',
                    'echarts/chart/bar',
                    'echarts/chart/pie',
                    'echarts/chart/funnel'

                ],
                function (ec) { //
                    var myChart = ec.init(element[0]);
                    // 为echarts对象加载数据
                    myChart.setOption(scope.option);
                }
            );
        }
    }
})
.directive("tablefield", function () {
    return {
        require: "ngModel",
        link: function (scope, element, attrs, ngModel) {
            var table = /^(?!_)(?!.*?_$)[a-zA-Z_]+$/;
            var t2 = /^[a-zA-Z]+$/i;
            var not = /^(?!(?:__halt_compiler|abstract|and|array|as|break|callable|case|catch|class|clone|const|continue|declare|default|die|do|echo|else|elseif|empty|enddeclare|endfor|endforeach|endif|endswitch|endwhile|eval|exit|extends|final|for|foreach|function|global|goto|if|implements|include|include_once|instanceof|insteadof|interface|isset|list|namespace|new|or|print|private|protected|public|require|require_once|return|static|switch|throw|trait|try|unset|use|var|while|xor|__class__|__dir__|__file__|__function__|__line__|__method__|__namespace__|__trait__|ci_controller|default|index|authox_controller|my_controller|api_controller|ci_model|my_model|base_model|api_model|authox|captcha|controller|group|group_detail|login|logout|manage|method|module|reload|user|welcome|pagenum|pagesize|select|like|order|checked|deletes)$)/;
            if (!ngModel) {
                return false;
            }
            ngModel.$parsers.unshift(function (viewValue) {
                v = angular.lowercase(viewValue);
                if ((table.test(viewValue) || t2.test(viewValue)) && not.test(v)) {
                    //匹配
                    ngModel.$setValidity("tablefield", true);
                }
                else {
                    ngModel.$setValidity("tablefield", false);
                }
                return viewValue;
            });
        }
    };
})
.directive("tablename", function () {
    return {
        require: "ngModel",
        link: function (scope, element, attrs, ngModel) {
            var table = /^(?!_)(?!.*?_$)[a-zA-Z][a-zA-Z0-9_]+$/;
            var t2 = /^[a-zA-Z]+$/i;
            if (!ngModel) {
                return false;
            }
            ngModel.$parsers.unshift(function (viewValue) {

                if (table.test(viewValue) || t2.test(viewValue)) {
                    //匹配
                    ngModel.$setValidity("tablename", true);
                }
                else {
                    ngModel.$setValidity("tablename", false);
                }
                return viewValue;
            });
        }
    };
})
.directive("notclass", function () {
    return {
        require: "ngModel",
        link: function (scope, element, attrs, ngModel) {
            var notclass = /^(?!(?:__halt_compiler|abstract|and|array|as|break|callable|case|catch|class|clone|const|continue|declare|default|die|do|echo|else|elseif|empty|enddeclare|endfor|endforeach|endif|endswitch|endwhile|eval|exit|extends|final|for|foreach|function|global|goto|if|implements|include|include_once|instanceof|insteadof|interface|isset|list|namespace|new|or|print|private|protected|public|require|require_once|return|static|switch|throw|trait|try|unset|use|var|while|xor|__class__|__dir__|__file__|__function__|__line__|__method__|__namespace__|__trait__|ci_controller|default|index|authox_controller|my_controller|api_controller|ci_model|my_model|base_model|api_model|authox|captcha|controller|group|group_detail|login|logout|manage|method|module|reload|user|welcome)$)/;
            //TODO: 记得将来写的控制器也加上
            if (!ngModel) {
                return false;
            }
            ngModel.$parsers.unshift(function (viewValue) {
                v = angular.lowercase(viewValue);
                if (notclass.test(v)) {
                    //匹配
                    ngModel.$setValidity("notclass", true);
                }
                else {
                    ngModel.$setValidity("notclass", false);
                }
                return viewValue;
            });
        }
    };
})
.directive('cgsGreet', ['$interval', 'dateFilter',
    function ($interval, dateFilter) {
        return {
            restrict: 'EA',
            scope: {
                format: '='
            },
            template: '{{greetMsg}}',
            link: function (scope, element, attrs) {
                var intervalId;

                function updateTime() {
                    var hour = new Date().getHours();
                    if (hour < 12) {
                        scope.greetMsg = '上午好！'
                    }
                    else if (hour >= 12 && hour <= 18) {
                        scope.greetMsg = '下午好！'
                    }
                    else {
                        scope.greetMsg = '晚上好！'
                    }
                }

                element.on('$destroy', function () {
                    $interval.cancel(intervalId);
                });
                updateTime();
                intervalId = $interval(function () {
                    updateTime(); // update DOM
                }, 1000 * 60 * 60);
            }
        }
    }])
.directive('cgsHighcharts',
    ['$rootScope', '$http',
        function ($rootScope, $http) {
            return {
                require: '?ngModel',
                restrict: 'EA',
                scope: {options: '='},
                link: function (scope, element, attrs, ngModel) {
                    Highcharts.setOptions({global: {useUTC: false}});
                    scope.$watch('options', function (o, n) {
                        var options = scope.options;
                        //charts
                        options.chart = options.chart || {};
                        options.chart.spacing = options.chart.spacing || [20, 0, 10, 10];
                        options.credits = options.credits || {enabled: false};
                        options.legend = options.legend || {enabled: false};
                        options.exporting = options.exporting || {enabled: false};
                        options.title = options.title || {text: ""};
                        //yAxis
                        options.yAxis = options.yAxis || {title: {text: ""}};
                        options.yAxis.title = options.yAxis.title || {text: ''};
                        if (typeof options.yAxis.lineWidth == 'undefined') {
                            options.yAxis.lineWidth = 2;
                        }
                        options.yAxis.lineColor = options.yAxis.lineColor || '#4488BB';
                        options.yAxis.labels = options.yAxis.labels || {};
                        if (typeof options.yAxis.labels.x == 'undefined') {
                            options.yAxis.labels.x = -5;
                        }
                        //xAxis
                        options.xAxis = options.xAxis || {};
                        if (typeof options.xAxis.lineWidth == 'undefined') {
                            options.xAxis.lineWidth = 2;
                        }
                        options.xAxis.lineColor = options.xAxis.lineColor || '#4488BB';
                        if (typeof options.xAxis.tickLength == 'undefined') {
                            options.xAxis.tickLength = 5;
                        }
                        options.xAxis.labels = options.xAxis.labels || {};
                        if (typeof options.xAxis.labels.y == 'undefined') {
                            options.xAxis.labels.y = 13;
                        }
                        if (typeof options.xAxis.maxPadding == 'undefined') {
                            options.xAxis.maxPadding = 0;
                        }
                        if (typeof options.xAxis.minPadding == 'undefined') {
                            options.xAxis.minPadding = 0;
                        }
                        var chart;
                        try {
                            chart = $(element).highcharts(options);
                            if (chart) {
                                chart.destroy();
                            }
                        } catch (e) {

                        }
                        chart = $(element).highcharts(options);
                        if (ngModel) {
                            ngModel.$setViewValue(chart);
                        }
                    });
                    scope.$on('$destroy', function () {
                        var chart = $(element).highcharts();
                        if (chart) {
                            chart.destroy();
                        }
                    });
                }
            };
        }
    ])


    // myApp.controller("MyAppCtrl", ['$scope', function($scope) {
    //     $scope.items = [{id: "x", value: 'carrot'},
    //         {id: "y", value: 'cucumber'},
    //         {id: "z", value: 'cabbage'}];
    // }]);
.directive('dynamicName', function ($compile, $parse) {
    return {
        restrict: 'A',
        terminal: true,
        priority: 100000,
        link: function (scope, elem) {
            var name = $parse(elem.attr('dynamic-name'))(scope);
            elem.removeAttr('dynamic-name');
            elem.attr('name', name);
            $compile(elem)(scope);
        }
    };
})
.factory('uuid2', [
    function () {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }

        return {

            newuuid: function () {
                // http://www.ietf.org/rfc/rfc4122.txt
                var s = [];
                var hexDigits = "0123456789abcdef";
                for (var i = 0; i < 36; i++) {
                    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
                }
                s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
                s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
                s[8] = s[13] = s[18] = s[23] = "-";
                return s.join("");
            },
            newguid: function () {
                return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                    s4() + '-' + s4() + s4() + s4();
            },
            newid: function () {
                return s4() + s4() + s4() + s4();
            }
        }

    }])