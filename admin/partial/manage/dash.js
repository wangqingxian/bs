/**
 * Created by Administrator on 2017/3/1.
 */
angular.module("manageController")
.controller("manageDashCtrl",function ($scope,$interval,$timeout,$http,$manageAction)
{
    $scope.memConfig ={
        theme:'default',
        dataLoaded:true
    };

    $scope.cpuConfig ={
        theme:'default',
        dataLoaded:true
    };

    $scope.memOption =
    {
        title: {
            text: "内存使用率",
            x: "center"
        },
        tooltip: {
            trigger: "item",
                formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient: "vertical",
                x: "left",
                data: ["已使用", "未使用"]
        },
        toolbox: {
            feature: {
                mark: {
                    show: true
                },
                dataView: {
                    show: true,
                        readOnly: true
                },
                restore: {
                    show: true
                },
                saveAsImage: {
                    show: true
                }
            }
        },
        calculable: true,
        series: [
        {
            name: "cpu使用率",
            type: "pie",
            radius: ["50%", "70%"],
            itemStyle: {
                normal: {
                    label: {
                        show: false
                    },
                    labelLine: {
                        show: false
                    }
                },
                emphasis: {
                    label: {
                        show: true,
                        position: "center",
                        textStyle: {
                            fontSize: "30",
                            fontWeight: "bold"
                        }
                    }
                }
            },
            data: [
                {
                    name:"已使用",
                    value:0
                },
                {
                    name:"未使用",
                    value:100
                }
            ]
        }
    ]
    };

    $scope.cpuOption = {
        title: {
            text: "CPU使用率",
            x: "center"
        },
        tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient: "vertical",
            x: "left",
            data: ["已使用", "未使用"]
        },
        toolbox: {
            feature: {
                mark: {
                    show: true
                },
                dataView: {
                    show: true,
                    readOnly: true
                },
                restore: {
                    show: true
                },
                saveAsImage: {
                    show: true
                }
            }
        },
        calculable: true,
        series: [
            {
                name: "cpu使用率",
                type: "pie",
                radius: ["50%", "70%"],
                itemStyle: {
                    normal: {
                        label: {
                            show: false
                        },
                        labelLine: {
                            show: false
                        }
                    },
                    emphasis: {
                        label: {
                            show: true,
                            position: "center",
                            textStyle: {
                                fontSize: "30",
                                fontWeight: "bold"
                            }
                        }
                    }
                },
                data: [
                    {
                        name: "已使用",
                        value: 0
                    },
                    {
                        name: "未使用",
                        value: 100
                    }
                ]
            }
        ]
    };

    $scope.getDash=function ()
    {
         $http.get($manageAction.dash)
             .success(function (result)
             {
                 $scope.memOption.series[0].data=result.data.mem;
                 $scope.cpuOption.series[0].data=result.data.cpu;
             })
    }
    $scope.getDash();
    $scope.timer=$interval(function ()
    {
        $scope.getDash();
    }, 5000);


    $scope.$on('$destroy',function(){
        $interval.cancel($scope.timer);
    })
})