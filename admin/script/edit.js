/**
 * Created by Administrator on 2017/3/10.
 */
const app=angular.module("ac",
        [
            // "ui.router",
            "ui.bootstrap",
            // "oc.lazyLoad",
            "ngMessages",
            "ngAnimate",
            "ui.tree",
            // "ui.router.requirePolyfill",
            "ng-echarts",
            "angular-cgs-utils",
            "appBase",
            "ngLodash",
            "colorpicker.module"
        ]);
app.run(['$rootScope', function ($rootScope) {

}]);
app.config(function ($interpolateProvider)
{
    $interpolateProvider.startSymbol('{!');
    $interpolateProvider.endSymbol('!}');
});
app.value("$editAction",{
   save:"html/save"
});
app.controller("rootController",function (
    $http,$scope,$rootScope,$q,$location,$timeout,$interval,
    $document,$window,$sce,$log,$compile,$filter,uuid2,$parse,lodash,$editAction,$uibModal)
{
    //data-dom-type=[
    //  normal,
    //  nav,
    //  nav-item,
    //  document,
    //  p
    //  a,
    //  img,
    //  repeat,   ng-repeat循环模版
    //  table,
    //  tr,
    //  tb,
    //  ul,
    //  li,
    //  page,
    //  layout,
    //  carousel, 轮播图
    //  movie
    //]
    //not_drag 保存不能拖拽的data-dom-option
    $scope.not_drag=[
        "nav-item"
    ];
    $scope.stop_a=function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
    }
    $scope.data_show_hide=false;
    let js_data=JSON.parse($("#json").text());
    $scope.select={};
    //保存从后台获取的数据
    $scope.show=js_data.hasOwnProperty("show")?js_data["show"]:{};
    //获取数据的函数配置
    $scope.getdata=js_data.hasOwnProperty("getdata")?js_data["getdata"]:{};

    $scope.select["background-repeat"]=[
        "repeat",
        "repeat-x",
        "repeat-y",
        "no-repeat",
        "inherit"
    ];
    $scope.select["background-attachment"]=[
        "scroll",
        "fixed",
        "inherit"
    ]
    $scope.select["font-weight"]=[
        "normal",
        "bold",
        "bolder",
        "lighter",
        "100",
        "200",
        "300",
        "400",
        "500",
        "600",
        "700",
        "800",
        "900",
        "inherit"
    ];
    $scope.select["border-style"]=[
        "none",
        "hidden",
        "dotted",
        "dashed",
        "solid",
        "double",
        "inherit"
    ];
    $scope.select['list-style-type']=[
        "disc",
        "circle",
        "square",
        "decimal",
        "decimal-leading-zero",
        "lower-roman",
        "upper-roman",
        "lower-greek",
        "lower-latin",
        "upper-latin",
        "armenian",
        "georgian",
        "none",
        "inherit"
    ];
    $scope.select["position"]=[
        "absolute",
        "fixed",
        "relative",
        "static",
        "inherit"
    ];
    $scope.select["text-align"]=[
        "left",
        "right",
        "center",
        "justify",
        "inherit",
        "start"
    ];
    $scope.select["float"]=[
        "left",
        "right",
        "none",
        "inherit",
    ];
    $scope.select["display"]=[
        "none",
        "block",
        "inline",
        "inline-block",
        "list-item",
        "run-in",
        "table",
        "inline-table",
        "table-row-group",
        "table-header-group",
        "table-footer-group",
        "table-row",
        "table-column-group",
        "table-column",
        "table-cell",
        "table-caption",
        "inherit",
    ];
    $scope.select["cursor"]=[
        "default",
        "auto",
        "crosshair",
        "pointer",
        "move",
        "e-resize",
        "ne-resize",
        "nw-resize",
        "n-resize",
        "se-resize",
        "sw-resize",
        "s-resize",
        "w-resize",
        "text",
        "wait",
        "help"
    ];


    $scope.css=[
        "color",
        "background-color",
        "background-position",
        "background-size",
        "background-repeat",
        "background-attachment",
        "background-image",
        "font-size",
        "font-weight",
        "border",
        "border-top-color",
        "border-top-style",
        "border-top-width",
        "border-right-color",
        "border-right-style",
        "border-right-width",
        "border-bottom-color",
        "border-bottom-style",
        "border-bottom-width",
        "border-left-color",
        "border-left-style",
        "border-left-width",
        "border-top-left-radius",
        "border-top-right-radius",
        "border-bottom-left-radius",
        "border-bottom-right-radius",
        "height",
        "width",
        "list-style-type",
        "margin-bottom",
        "margin-left",
        "margin-right",
        "margin-top",
        "padding-bottom",
        "padding-left",
        "padding-right",
        "padding-top",
        "position",
        "left",
        "bottom",
        "top",
        "right",
        "text-align",
        "float",
        "display",
        "cursor"
    ];
    //$scope.edit用于保存当前编辑的元素的信息
    $scope.edit={
        button:"",
        sort:false,
        drag:false
    };
    const edit_box=$("#edit");

    $scope.state="index";

    $scope.del_px=function (input="0px")
    {
        return parseInt(input.substring(0,input.length-2));
    }
    $scope.getInfo=function (select)
    {
        $scope.edit.item=select;
        $scope.edit.item_id="#"+select.attr("id");
        $scope.edit.tagName=select[0].tagName;
        $scope.edit.name=select.attr("name");
        $scope.edit.id=select.attr("id");
        $scope.edit.type=$scope.edit.item.attr("data-dom-type");
        $scope.edit.sort=false;
        $scope.edit.drag=false;
    }
    $scope.getCss=function (select)
    {
        $scope.edit.css=select.css($scope.css);
        $scope.edit.old_css=angular.copy($scope.edit.css);
        let x=$scope.edit.css["background-position"].split(" ");
        x[0]=parseInt(x[0].substring(0,x[0].length-1));
        x[1]=parseInt(x[1].substring(0,x[1].length-1));
        $scope.edit.css["background-position"]=x;
        let x2=$scope.edit.css["background-size"].split(" ");
        if(x2[0])
        {
            if(x2[0]=="auto"||x2[0]=="cover"||x2[0]=="contain")
                x2[0]="100%";
            x2[0]=parseInt(x2[0]);
        }
        if(x2[1])
        {
            if(x2[1]=="auto")
                x2[1]="100%";
            x2[1]=parseInt(x2[1]);
        }
        else
        {
            x2[1]=100;
        }
        $scope.edit.css["background-size"]=x2;
        $scope.edit.css["font-size"]=parseInt($scope.edit.css["font-size"]);
        $scope.edit.css["border-top-width"]=parseInt($scope.edit.css["border-top-width"]);
        $scope.edit.css["border-right-width"]=parseInt($scope.edit.css["border-right-width"]);
        $scope.edit.css["border-bottom-width"]=parseInt($scope.edit.css["border-bottom-width"]);
        $scope.edit.css["border-left-width"]=parseInt($scope.edit.css["border-left-width"]);
        $scope.edit.css["border-top-left-radius"]=$scope.del_px($scope.edit.css['border-top-left-radius']);
        $scope.edit.css["border-top-right-radius"]=$scope.del_px($scope.edit.css['border-top-right-radius']);
        $scope.edit.css["border-bottom-left-radius"]=$scope.del_px($scope.edit.css['border-bottom-left-radius']);
        $scope.edit.css["border-bottom-right-radius"]=$scope.del_px($scope.edit.css['border-bottom-right-radius']);
        $scope.edit.css["height"]=$scope.del_px($scope.edit.css['height']);
        $scope.edit.css["width"]=$scope.del_px($scope.edit.css['width']);
        $scope.edit.css['margin-top']=$scope.del_px($scope.edit.css['margin-top']);
        $scope.edit.css['margin-right']=$scope.del_px($scope.edit.css['margin-right']);
        $scope.edit.css['margin-bottom']=$scope.del_px($scope.edit.css['margin-bottom']);
        $scope.edit.css['margin-left']=$scope.del_px($scope.edit.css['padding-left']);
        $scope.edit.css['padding-top']=$scope.del_px($scope.edit.css['padding-top']);
        $scope.edit.css['padding-right']=$scope.del_px($scope.edit.css['padding-right']);
        $scope.edit.css['padding-bottom']=$scope.del_px($scope.edit.css['padding-bottom']);
        $scope.edit.css['padding-left']=$scope.del_px($scope.edit.css['padding-left']);
        $scope.edit.css["top"]=$scope.del_px($scope.edit.css["top"]=="auto"?"0px":$scope.edit.css["top"]);
        $scope.edit.css["right"]=$scope.del_px($scope.edit.css["right"]=="auto"?"0px":$scope.edit.css["right"]);
        $scope.edit.css["bottom"]=$scope.del_px($scope.edit.css["bottom"]=="auto"?"0px":$scope.edit.css["bottom"]);
        $scope.edit.css["left"]=$scope.del_px($scope.edit.css["left"]=="auto"?"0px":$scope.edit.css["left"]);



    }

    $scope.baseCss=function ()
    {
        let back={};
        let css=$scope.edit.css;
        css["background-position"]=$scope.edit.css["background-position"][0]+"% "+$scope.edit.css["background-position"][1]+"%";
        css['background-size']=$scope.edit.css["background-size"][0]+"% "+$scope.edit.css["background-size"][1]+"%";

        css["font-size"]=$scope.edit.css["font-size"]+"px";
        css["border-top-width"]=$scope.edit.css["border-top-width"]+"px";
        css["border-right-width"]=$scope.edit.css["border-right-width"]+"px";
        css["border-bottom-width"]=$scope.edit.css["border-bottom-width"]+"px";
        css["border-left-width"]=$scope.edit.css["border-left-width"]+"px";
        css["border-top-left-radius"]=$scope.edit.css['border-top-left-radius']+"px";
        css["border-top-right-radius"]=$scope.edit.css['border-top-right-radius']+"px";
        css["border-bottom-left-radius"]=$scope.edit.css['border-bottom-left-radius']+"px";
        css["border-bottom-right-radius"]=$scope.edit.css['border-bottom-right-radius']+"px";
        css["height"]=$scope.edit.css['height']+"px";
        css["width"]=$scope.edit.css['width']+"px";
        css['margin-top']=$scope.edit.css['margin-top']+"px";
        css['margin-right']=$scope.edit.css['margin-right']+"px";
        css['margin-bottom']=$scope.edit.css['margin-bottom']+"px";
        css['margin-left']=$scope.edit.css['padding-left']+"px";
        css['padding-top']=$scope.edit.css['padding-top']+"px";
        css['padding-right']=$scope.edit.css['padding-right']+"px";
        css['padding-bottom']=$scope.edit.css['padding-bottom']+"px";
        css['padding-left']=$scope.edit.css['padding-left']+"px";
        css["top"]=$scope.edit.css["top"]+"px";
        css["right"]=$scope.edit.css["right"]+"px";
        css["bottom"]=$scope.edit.css["bottom"]+"px";
        css["left"]=$scope.edit.css["left"]+"px";

        for(let n in css)
        {
            if(css[n]!=$scope.edit.old_css[n])
            {
                back[n]=css[n];
            }
        }

        return back;
    }

    $scope.getInfo($("#container"));
    $scope.getCss($("#container"));

    $scope.item_select=function (item)
    {
        //更换选定元素是清除排序拖拽
        if($scope.edit.drag)
            $scope.edit_drag("stop");
        if($scope.edit.sort)
            $scope.edit_sort("stop");
        let select=angular.element(item.target).parent();
        select.css("outline","red dotted thick");
        $scope.getInfo(select);

        $scope.state="index";

    }

    $scope.item_init=function ()
    {
        //更换选定元素是清除排序拖拽
        if($scope.edit.drag)
            $scope.edit_drag("stop");
        if($scope.edit.sort)
            $scope.edit_sort("stop");

        $scope.getInfo($("#container"));

        $scope.state="index";
    }

    $scope.remove_init=function ()
    {
        if(window.confirm("确定要清空所有元素，该操作无法撤消"))
        {
            $("#container").html("");
            edit_box.html("");
        }
    }

    $scope.item_remove=function (item)
    {
        let select=angular.element(item.target).parent();

        if(window.confirm("确定要删除ID="+select.attr("id")+"的元素么\n删除后无法恢复"))
        {
            edit_box.find("#"+select.attr("id")).remove();
            if(select.attr("id")==$scope.edit.item.attr("id"))
            {
                $scope.getInfo($("#container"));
                $scope.edit.state="index";
            }
            select.remove();
        }
    }

    $scope.edit_remove=function()
    {
        if($scope.edit.item.attr("id")=="container")
        {
            alert("container作为容器无法删除")
        }
        else
        {
            if(window.confirm("确定要删除ID="+$scope.edit.item.attr("id")+"的元素么\n删除后无法恢复"))
            {
                edit_box.find("#"+$scope.edit.item.attr("id")).remove();
                $scope.edit.item.remove();
                $scope.getInfo($("#container"));
                $scope.edit.state="index";
            }
        }

    }
    $scope.edit_sort=function (is_start)
    {
        if(is_start=="start")
        {
            $scope.edit.sort=true;
            $scope.edit.item.sortable({
                handle:".edit-button-2",
                stop:function (event,ui)
                {
                    //console.log(ui.item);
                    //console.log(ui.item.prev());
                    let edit_now=edit_box.find("#"+ui.item.attr("id"));
                    if(ui.item.prev().length==0)
                    {
                        edit_box.find("#"+ui.item.parent().attr("id")).prepend(edit_now.prop("outerHTML"));
                    }
                    else
                    {
                        edit_box.find("#"+ui.item.prev().attr("id")).after(edit_now.prop("outerHTML"));
                    }
                    edit_now.remove();
                }
            });
        }
        else if(is_start=="stop")
        {
            $scope.edit.sort=false;
            $scope.edit.item.sortable("destroy");
        }
    }

    $scope.edit_drag=function (is_start)
    {
        if(is_start=="start")
        {
            if($scope.edit.item.attr("id")=="container")
            {
                alert("container作为容器无法拖拽")
            }
            else if(lodash.findIndex($scope.not_drag,$scope.edit.type))
            {
                alert("该元素类型不适合拖拽");
            }
            else
            {
                $scope.edit.drag=true;
                $scope.edit.item.attr("draggable",true);
                $scope.edit.item.on("dragstart",function (ev)
                {
                    ev.originalEvent.dataTransfer.setData("ID",ev.target.id);
                })
            }

        }
        else if(is_start=="stop")
        {
            $scope.edit.drag=false;
            $scope.edit.item.attr("draggable",false);
            $scope.edit.item.off("dragstart");
        }
    }

    $scope.edit_close=function ()
    {
        if(confirm("确定要关闭编辑？"))
        {
            window.close();
        }
    }

    //修改css
    $scope.edit_css=function ()
    {
        $scope.state="css";
        $scope.getCss($scope.edit.item);
    }
    //修改class
    $scope.edit_class=function ()
    {
        $scope.state="class";
    }

    $scope.add_dom=function ()
    {
        $scope.state="dom";
        //更换选定元素是清除排序拖拽
        if($scope.edit.drag)
            $scope.edit_drag("stop");
        if($scope.edit.sort)
            $scope.edit_sort("stop");
    }


    //确定修改css
    $scope.css_sure=function ()
    {
        let css=$scope.baseCss();
        $scope.edit.item.css(css);
        edit_box.find($scope.edit.item_id).css(css);
        $scope.edit.item.data("old",$scope.edit.old_css);
        let new_css=$scope.edit.item.css(["min-height","min-width","position","margin-top"]);
        $("body").data($scope.edit.item.attr("id"),{
            "min-height":new_css["min-height"],
            "min-width":new_css["min-width"],
            "position":new_css["position"],
            "margin-top":new_css["margin-top"],
            "outline":""
        });
        $scope.getCss($scope.edit.item);
        $scope.state="index";
    }

    //确定修改class
    $scope.class_sure=function ()
    {

    }
    //css返回index
    $scope.css_back=function ()
    {
        $scope.state="index";
        $scope.getCss($scope.edit.item);
    }
    //class返回index
    $scope.class_back=function ()
    {
        $scope.state="index";
        $scope.getCss($scope.edit.item);
    }

    $scope.data_back=function ()
    {
        $scope.state="index";
    }

    $scope.data_delete=function (api)
    {
        delete $scope.getdata[api.show];

        let json=angular.toJson({
            show:$scope.show,
            getdata:$scope.getdata,
        })

        $("#json").html(json);
    }

    $scope.edit_save=function ()
    {
        //半成品
        let post={
            html:edit_box.html(),
            file:$("body").attr("id"),
            json:$("#json").text()
        }
        $http.post($editAction.save,post)
            .success(function (result) {
                if(!result.status)
                {
                    if(result.message=="登录超时，请重新登录。")
                    {
                        //TODO:弹出登录弹窗
                    }
                    else
                    {
                        alert(result.message);
                    }
                }
                else
                {
                    window.location.reload(true);
                }

            })
    }

    $scope.get_api_data=function ()
    {
        $scope.state="data";
    }

    $scope.data_detail=function (api)
    {
        $scope.data_show_hide=true;

        $scope.show_data=$scope.show[api.show];
    }

    $scope.data_detail_back=function ()
    {
        $scope.data_show_hide=false;
    }

    $scope.dom_back=function ()
    {
        $scope.state='index';
    }

    $scope.add_api_data=function()
    {
        let modal=$uibModal.open({
            templateUrl: "admin/partial/edit/api_data_ctrl.html",
            controller: "api_data_ctrl",
            backdrop: "static",
            size:"lg",
            resolve: {
                api_data:function ()
                {
                    return {
                        show:angular.copy($scope.show),
                        getdata:angular.copy($scope.getdata),
                    };
                },
            }
        });
        modal.result.then(function (reback)
        {
            //reback  close返回的值
            // $uibModalInstance.close(reback)
            $scope.show=reback.show;
            $scope.getdata=reback.getdata;

            let json=angular.toJson(reback);

            $("#json").html(json);
        },
        function (re)
        {
            //re dismiss返回的值
            //$uibModalInstance.dismiss(re)
        });
    }

    $scope.add_nav=function ()
    {
        let id_1=uuid2.newid();
        let id_2=uuid2.newid();
        let temp=`
<div class="row ac-nav" ac-edit="" id="${id_1}" name="${id_1}" data-dom-type="nav">
    <div class="ac-nav-item" ac-edit="" id="${id_2}" name="${id_2}" data-dom-type="nav-item">导航1</div>
</div>
        `;
        let ele=$compile(temp)($scope);


        $scope.edit.item.append(ele);
        if($scope.edit.item_id=="#container")
        {
            edit_box.append(temp);
        }
        else
        {
            edit_box.find($scope.edit.item_id).append(temp);
        }
    }



});
app.controller("api_data_ctrl",function ($scope,$uibModalInstance,api_data,$http)
{
    $scope.api_data=api_data;
    $scope.state="show";
    $scope.show={};
    $scope.edit={
        show:"",
        url:"",
        module:""
    };
    $scope.module={};

    $http.post("module/page",{pageSize:9999,pageNum:1})
        .success(function (result)
        {
            if(result.status)
            {
                $scope.module=result.data;
            }
        })

    $scope.cancel=function ()
    {
        $uibModalInstance.dismiss("cancel");
    }

    $scope.add=function ()
    {
        if($scope.edit.show==""||$scope.api_data.getdata.hasOwnProperty($scope.edit.show))
        {
            alert("名称不合适");
        }
        else
        {
            let r1 = /^(?!_)(?!.*?_$)[a-zA-Z][a-zA-Z0-9_]+$/;
            let r2 = /^[a-zA-Z]+$/i;

            if(r1.test($scope.edit.show)||r2.test($scope.edit.show))
            {
                if($scope.edit.module!="")
                {
                    $scope.edit.url="api/"+$scope.edit.module+"/page";

                    $http.post("manage/module_name",{module:$scope.edit.module})
                        .success(function (result)
                        {
                            if(result.status)
                            {
                                $scope.api_data.show[$scope.edit.show]=result.data;
                                $scope.api_data.getdata[$scope.edit.show]=$scope.edit;
                                $uibModalInstance.close($scope.api_data);
                            }
                            else
                            {
                                alert("添加失败"+result.message);
                            }

                        })
                }
                else
                {
                    alert("来源必选")
                }
            }
            else
            {
                alert("名称不合适，只能有英文");
            }
        }
    }
})
app.directive("acEdit",function ($compile, $parse,uuid2)
{
    return {
        restrict: 'A',
        link: function (scope, elem)
        {
            //无法自行解决
            //可以尝试tooltips
            elem.mouseenter(function ()
            {
                if(elem.children(".edit-button-1").length<1)
                {
                    $("body").data(elem.attr("id"),elem.css(["min-height","min-width","position","margin-top"]));
                    elem.css("min-height","30px");
                    elem.css("min-width","50px");
                    elem.css("position","relative");
                    elem.css("margin-top","20px");
                    elem.css("outline","red dotted thick");
                    let edit=`<button ng-click="item_select($event)" class="btn btn-default btn-xs edit-button-1">选中</button>`;
                    edit+=`<a  class="btn btn-info btn-xs edit-button-2">排序</a>`;
                    edit+=`<button ng-click="item_remove($event)"   class="btn btn-danger btn-xs edit-button-3">删除</button>`;
                    edit+=`<a  class="btn btn-primary btn-xs edit-button-4">移动</a>`;

                    let t=$compile(edit)(scope);
                    elem.append(t);
                    scope.edit.button=t;
                    scope.$apply();
                }
            });

            elem.mouseleave(function ()
            {
                elem.css($("body").data(elem.attr("id")));
                elem.css('outline',"");
                elem.children(".edit-button-1").remove();
                elem.children(".edit-button-2").remove();
                elem.children(".edit-button-3").remove();
                elem.children(".edit-button-4").remove();

            })


        }
    };
});
app.directive("acDragIn",function ($compile, $parse,uuid2)
{
    return {
        restrict: 'A',
        link: function (scope, elem)
        {

            elem.on("dragenter",function (ev)
            {
                if(scope.edit.drag)
                {
                    let ele=angular.element(ev.target);
                    ele.css("outline","red dotted thick");
                    ele.on("dragover",function (ev)
                    {
                        ev.preventDefault();
                    })
                    ele.on("drop",function (ev)
                    {
                        if(scope.edit.drag)
                        {
                            ev.preventDefault();
                            let event=ev.originalEvent;
                            let data=event.dataTransfer.getData("ID");
                            //TODO： 未完成 有报错
                            let temp=$('#'+data).prop("outerHTML");
                            temp=$compile(temp)(scope);
                            $("#"+data).remove();
                            angular.element(ev.target).append(temp);
                            angular.element(ev.target).css("outline","");
                            let edit_box=$("#edit");
                            let move=edit_box.find("#"+data);
                            let mt=move.prop("outerHTML");
                            move.remove();
                            edit_box.find("#"+ev.target.id).append(mt);
                            scope.edit.item=$(temp);
                            scope.getInfo(scope.edit.item);
                            scope.edit_drag("stop");
                            scope.$apply();

                        }
                        //#edit中保存变化
                    })
                    elem.on("dragleave",function (ev)
                    {
                        let e=angular.element(ev.target);
                        e.off("dragover");
                        e.off("drop");
                        e.off("dragleave");
                        e.css("outline","");
                    })
                }
            })

        }
    };
});
app.directive("acColor",function () {
    return {
        require:"ngModel",
        link:function (scope,elem,attrs,ngModel)
        {
            ngModel.$render = function() {
                elem.css({
                    "background-color":ngModel.$viewValue
                })
            };
            ngModel.$parsers.unshift(function (nv)
            {
                elem.css({
                    "background-color":nv
                })
                return nv;
            })
        }
    }
})
