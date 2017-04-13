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
            "colorpicker.module",
            "meta.umeditor",
            "ngFileUpload"
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
    $document,$window,$sce,$log,$compile,$filter,uuid2,$parse,
    lodash,$editAction,$uibModal,HtmlUtil)
{
    $scope.dom_type= {
        normal:"普通元素",
        nav:"导航条",
        "nav-item":"导航按钮",
        document:"格式文本",
        "document-data":"格式文本",
        p:"无格式文本",
        a:"超链接",
        img:"图片",
        repeat:"循环模版",
        "in-repeat":"循环模版子元素",
        "table":"表格",
        tr:"表格的行",
        tb:"表格的列",
        ul:"列表",
        li:"列表的行",
        page:"分页按钮",
        "layout-row":"布局div(行)", //布局div row col-xs - *
        "layout-col":"布局div(列)",
        carousel:"轮播图",
        movie:"视频",
        "movie-data":"视频",
        container:"底部容器"
    }

    //not_drag 保存不能拖拽的data-dom-option
    $scope.not_drag=[
        "nav",
        "nav-item",
        "repeat",
        "in-repeat"
    ];

    $scope.not_add=[
        "nav-item",
        "p",
        "document",
        "document-data",
        "nav",
        "movie",
        "movie-data"
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
    $scope.pic=js_data.hasOwnProperty("pic")?js_data["pic"]:{};

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

    $scope.all_stop=function ()
    {
        if($scope.edit.drag)
            $scope.edit_drag("stop");
        if($scope.edit.sort)
            $scope.edit_sort("stop");

    }

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

    $scope.item_remove=function ($event)
    {
        $event.preventDefault();
        $event.stopPropagation();

        let select=angular.element($event.target).parent();

        if(window.confirm("确定要删除ID="+select.attr("id")+"的元素么\n删除后无法恢复"))
        {
            select.remove();
            edit_box.find("#"+select.attr("id")).remove();
            if(select.attr("id")==$scope.edit.item.attr("id"))
            {
                $scope.getInfo($("#container"));
                $scope.edit.state="index";
            }
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
                        let pid="#"+ui.item.parent().attr("id");
                        if(pid!="#container")
                            edit_box.find(pid).prepend(edit_now.prop("outerHTML"));
                        else if(pid=="#container")
                        {
                            edit_box.prepend(edit_now.prop("outerHTML"));
                        }
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
            else if(lodash.findIndex($scope.not_drag,o=>{return o==$scope.edit.type})>=0)
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

    $scope.findIndex=function (arr,ser)
    {
        return lodash.findIndex(arr,o=>{ return ser==o });
    }
    $scope.add_dom=function ()
    {
        if(lodash.findIndex($scope.not_add,o=>{ return o== $scope.edit.type})>=0)
        {
            alert("该元素内不能添加新元素");
        }
        else
        {
            $scope.state="dom";
            //更换选定元素是清除排序拖拽
            if($scope.edit.drag)
                $scope.edit_drag("stop");
            if($scope.edit.sort)
                $scope.edit_sort("stop");
        }
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
        delete $scope.show[api.show];

        let json=angular.toJson({
            show:$scope.show,
            getdata:$scope.getdata,
            pic:$scope.pic
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

            let json=angular.toJson({
                show:$scope.show,
                getdata:$scope.getdata,
                pic:$scope.pic
            })

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
        if(confirm("确定要在该元素内添加导航条"))
        {
            $scope.create_nav();
        }
    }

    $scope.create_nav=function ()
    {
        let id_1=uuid2.newid();
        let id_2=uuid2.newid();

        let temp=`
<div class="row ac-nav" ac-edit="" id="${id_1}" name="${id_1}" data-dom-type="nav">
    <div class="ac-nav-item" ac-edit="" id="${id_2}" name="${id_2}" data-dom-type="nav-item">
    <a  style="height: 100%;width: 100%" ng-click="stop_a($event)" data-a-type="href" href="">
        <div style="padding: 10px;width: 100%;height: 100%;">导航1</div>
    </a>
    </div>
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

    $scope.add_layout=function ()
    {
        let modal=$uibModal.open({
            templateUrl: "admin/partial/edit/add_layout_ctrl.html",
            controller: "add_layout_ctrl",
            backdrop: "static",
        });
        modal.result.then(function (reback)
            {
                //reback  close返回的值
                // $uibModalInstance.close(reback)
                $scope.create_col(reback.row,reback.col);
            },
            function (re)
            {
                //re dismiss返回的值
                //$uibModalInstance.dismiss(re)
            });
    }

    $scope.create_col=function (row,col)
    {
        let temp=``;
        if(row)
        {
            let row_id=uuid2.newid();
            temp+=`<div class="row" id="${row_id}" name="${row_id}" ac-edit ac-drag-in style="min-height: 40px;" data-dom-type="layout-row">`;
            let len=col.length;
            for (let i=0;i<len;i++)
            {
                let col_id=uuid2.newid();
                temp+=`<div class="${col[i]}" id="${col_id}" name="${col_id}" ac-edit ac-drag-in style="min-height: 35px" data-dom-type="layout-col"></div>`;
            }
            temp+="</div>";
        }
        else
        {
            let len=col.length;
            for (let i=0;i<len;i++)
            {
                let col_id=uuid2.newid();
                temp+=`<div class="${col[i]}" id="${col_id}" name="${col_id}" ac-edit ac-drag-in style="min-height: 35px" data-dom-type="layout-col"></div>`;
            }
        }


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

    $scope.add_p=function ()
    {
        let modal=$uibModal.open({
            templateUrl: "admin/partial/edit/add_p_ctrl.html",
            controller: "add_p_ctrl",
            backdrop: "static",
        });
        modal.result.then(function (reback)
            {
                //reback  close返回的值
                // $uibModalInstance.close(reback)
                $scope.create_p(reback);
            },
            function (re)
            {
                //re dismiss返回的值
                //$uibModalInstance.dismiss(re)
            });
    }

    $scope.create_p=function (p)
    {
        let temp=``;
        let uuid=uuid2.newid();
        let safe=HtmlUtil.htmlEncodeByRegExp(p.p);
        if(p.type=='p')
            temp+=`<div id="${uuid}" name="${uuid}" ac-edit data-dom-type="p"><p>${safe}</p></div>`
        else
            temp+=`<div id="${uuid}" name="${uuid}" ac-edit data-dom-type="p"><p>{{${safe}}</p></div>`;

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

    $scope.add_document=function ()
    {
        let modal=$uibModal.open({
            templateUrl: "admin/partial/edit/add_document_ctrl.html",
            controller: "add_document_ctrl",
            backdrop: "static",
        });
        modal.result.then(function (reback)
            {
                //reback  close返回的值
                // $uibModalInstance.close(reback)
                $scope.create_document(reback);
            },
            function (re)
            {
                //re dismiss返回的值
                //$uibModalInstance.dismiss(re)
            });
    }

    $scope.create_document=function (doc)
    {
        let safe=HtmlUtil.toSafeHtml(doc.document);
        let temp=``;
        let uuid=uuid2.newid();
        if(doc.type=="document")
        {
            temp+=`
<div id="${uuid}" name="${uuid}" ac-edit data-dom-type="document">
${safe}
</div>`;
        }
        else if(doc.type=="data")
        {
            temp+=`
<div id="${uuid}" name="${uuid}" ac-edit 
    data-dom-type="document-data" data-document-data="${safe}">
    {{${safe}|to_trusted}}
</div>`;
        }

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

    $scope.add_div=function ()
    {
        let modal=$uibModal.open({
            templateUrl: "admin/partial/edit/add_div_ctrl.html",
            controller: "add_div_ctrl",
            backdrop: "static",
        });
        modal.result.then(function (reback)
            {
                //reback  close返回的值
                // $uibModalInstance.close(reback)
                $scope.create_div(reback);
            },
            function (re)
            {
                //re dismiss返回的值
                //$uibModalInstance.dismiss(re)
            });
    }

    $scope.create_div=function (div)
    {
        let css="";
        let temp=``;
        if(typeof(div.height)!="undefined")
        {
            css+=`height:${div.height}px;`;
        }
        else
        {
            css+=`min-height:1px;`
        }

        if(typeof(div.width)!="undefined")
        {
            css+=`width:${div.width}px;`;
        }
        else
        {
            css+=`min-width:50px;`
        }

        css+=`color:${div.color};background-color:${div["background-color"]};`;
        let uuid=uuid2.newid();
        temp=`
<div id="${uuid}" name="${uuid}" style="${css}" ac-edit ac-drag-in data-dom-type="normal"></div>`;

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

    $scope.add_span=function()
    {
        if(confirm("你确定在当前选中元素中添加<span></span>"))
        {
            let temp=``;
            let uuid=uuid2.newid();

            temp+=`<div id="${uuid}" name="${uuid}"  style="min-height: 2px;min-width:50px;display: inline-block;"
                    ac-drag-in ac-edit data-dom-type="normal" ></div>`;

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
    }
    
    $scope.add_a=function ()
    {
        let modal=$uibModal.open({
            templateUrl: "admin/partial/edit/add_a_ctrl.html",
            controller: "add_a_ctrl",
            backdrop: "static",
        });
        modal.result.then(function (reback)
            {
                //reback  close返回的值
                // $uibModalInstance.close(reback)
                $scope.create_a(reback);
            },
            function (re)
            {
                //re dismiss返回的值
                //$uibModalInstance.dismiss(re)
            });
    }

    $scope.create_a=function (a)
    {
        let temp=``;
        let attr=``;
        if(a.type=="href")
        {
            attr+=` href="${a.url}" `;
        }
        else if(a.type=="sref")
        {
            attr+=` ui-sref="${a.url}" `;
        }
        else if(a.type=='data')
        {
            attr+=` ng-href={{${a.url}}} `;
        }
        let uuid=uuid2.newid();
        temp+=`<a id="${uuid}" name="${uuid}"  ${attr}  data-dom-type="a" ng-click="stop_a($event)" data-a-type="${a.type}"
                ac-edit ac-drag-in style="min-height: 2px;min-width: 15px;">${a.data}</a>`;

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

    $scope.add_img=function ()
    {
        let modal=$uibModal.open({
            templateUrl: "admin/partial/edit/add_img_ctrl.html",
            controller: "add_img_ctrl",
            backdrop: "static",
        });
        modal.result.then(function (reback)
            {
                //reback  close返回的值
                // $uibModalInstance.close(reback)
                $scope.create_img(reback);
            },
            function (re)
            {
                //re dismiss返回的值
                //$uibModalInstance.dismiss(re)
            });
    }

    $scope.create_img=function (img)
    {
        let temp=``;
        let uuid=uuid2.newid();
        temp+=`<div id="${uuid}" name="${uuid}" ac-edit data-dom-type="img">`
        if(img.type=='upload'||img.type=='out')
        {
            temp+=`
<img src="${img.src}" class="img-responsive">`;
        }
        else if(img.type=="data")
        {
            temp+=`
<img ng-src="{{${img.src}}" class="img-responsive">`;
        }
        temp+=`</div>`;

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

    $scope.not_edit=["container","normal","layout-row","layout-col"];
    $scope.edit_dom=function ()
    {
        /*
        * normal:"普通元素",
         nav:"导航条",
         "nav-item":"导航按钮",
         document:"格式文本",
         p:"无格式文本",
         a:"超链接",
         img:"图片",
         repeat:"循环模版",
         "in-repeat":"循环模版子元素",
         "table":"表格",
         tr:"表格的行",
         tb:"表格的列",
         ul:"列表",
         li:"列表的行",
         page:"分页按钮",
         "layout-row":"布局div(行)", //布局div row col-xs - *
         "layout-col":"布局div(列)",
         carousel:"轮播图",
         movie:"视频",
         container:"底部容器"
        * */
        $scope.state='edit_dom';
        $scope.all_stop();
    }

    $scope.edit_nav_add=function ()
    {
        let model=$uibModal.open({
            templateUrl:"admin/partial/edit/edit_nav_ctrl.html",
            controller:"edit_nav_ctrl",
            backdrop:"static"
        });
        model.result.then(function (reback)
        {
            $scope.nav_item_add(reback);
        },function (re) {
            console.log(re);
        })
    }

    $scope.nav_item_add=function (nav_item)
    {
        let temp=``;
        let uuid=uuid2.newid();
        let attr=``;
        if(nav_item.type=="sref")
        {
            attr+=` ui-sref="${nav_item.url}" `;
        }
        else if(nav_item.type=='data')
        {
            attr+=` ng-href={{${nav_item.url}} `;
        }
        else
        {
            attr+=` href="${nav_item.url}" `;
        }

        temp+=`
<div class="ac-nav-item" ac-edit="" id="${uuid}" name="${uuid}" 
    data-dom-type="nav-item">
    <a ${attr} style="height: 100%;width: 100%" ng-click="stop_a($event)" data-a-type="${nav_item.type}">
        <div style="padding: 10px;width: 100%;height: 100%;">${nav_item.data}</div>
    </a>
 </div>`;

        let ele=$compile(temp)($scope);

        $scope.edit.item.append(ele);
        edit_box.find($scope.edit.item_id).append(temp);

    }

    $scope.edit_nav_item_data=function ()
    {
        let text=$scope.edit.item.find("div").text();
        let modal=$uibModal.open({
            templateUrl:"admin/partial/edit/edit_nav_item_ctrl.html",
            controller:"edit_nav_item_ctrl",
            backdrop:"static",
            resolve:{
                text:function ()
                {
                    return angular.copy(text);
                }
            }
        });

        modal.result.then(function (re)
        {
            $scope.modify_nav_item_data(re);
        },function (re)
        {
            console.log(re);
        })
    }

    $scope.modify_nav_item_data=function (text)
    {
        $scope.edit.item.find("div").text(text);

        edit_box.find($scope.edit.item_id).find("div").text(text);
    }

    $scope.edit_nav_item_url=function ()
    {
        let a=$scope.edit.item.find("a");
        let type=a.attr("data-a-type");
        let url="";
        if(type=='href')
        {
            url=a.attr("href");
        }
        else if(type=="sref")
        {
            url=a.attr("ui-sref")
        }
        else if(type=='data')
        {
            let u=a.attr("ng-href");
            u=u.substring(2,u.length());
            u=u.substring(0,u.length-2);
            url=u;
        }

        let modal=$uibModal.open({
            templateUrl:"admin/partial/edit/edit_nav_url_ctrl.html",
            controller:"edit_nav_url_ctrl",
            backdrop:"static",
            resolve:{
                a:function ()
                {
                    return angular.copy({type:type,url:url});
                }
            }
        });

        modal.result.then(function (re)
        {
            $scope.modify_nav_item_url(re);
        },function (re)
        {
            console.log(re);
        })
    }

    $scope.modify_nav_item_url=function (nav_item)
    {
        let a=$scope.edit.item.find("a");
        let a_e=edit_box.find($scope.edit.item_id).find("a");
        let type=a.attr("data-a-type");

        if(type=='href')
        {
            a.removeAttr("href");
            a_e.removeAttr("href");
        }
        else if(type=='sref')
        {
            a.removeAttr("ui-sref");
            a_e.removeAttr("ui-sref");
        }
        else if(type=='data')
        {
            a.removeAttr("ng-href");
            a_e.removeAttr("ng-href");
        }

        if(nav_item.type=='sref')
        {
            a.attr("ui-sref",nav_item.url);
            a_e.attr("ui-sref",nav_item.url);
        }
        else if(nav_item.type=='href')
        {
            a.attr("href",nav_item.url);
            a_e.attr("href",nav_item.url);
        }
        else if(nav_item.type=='data')
        {
            a.attr("ng-href","{{"+nav_item.url+"}}")
            a_e.attr("ng-href","{{"+nav_item.url+"}}")
        }
    }

    $scope.edit_a_data=function ()
    {
        let text=$scope.edit.item.text();
        let modal=$uibModal.open({
            templateUrl:"admin/partial/edit/edit_a_data_ctrl.html",
            controller:"edit_a_data_ctrl",
            backdrop:"static",
            resolve:{
                text:function ()
                {
                    return angular.copy(text)
                }
            }
        })

        modal.result.then(function (re)
        {
            $scope.modify_a_data(re);
        },function (re)
        {
            console.log(re)
        })
    }

    $scope.modify_a_data=function (text)
    {
        $scope.edit.item.text(text);

        edit_box.find($scope.edit.item_id).text(text);
    }

    $scope.edit_a_url=function ()
    {
        let a=$scope.edit.item;
        let type=a.attr("data-a-type");
        let url="";
        if(type=='href')
        {
            url=a.attr("href");
        }
        else if(type=="sref")
        {
            url=a.attr("ui-sref")
        }
        else if(type=='data')
        {
            let u=a.attr("ng-href");
            u=u.substring(2,u.length());
            u=u.substring(0,u.length-2);
            url=u;
        }

        let modal=$uibModal.open({
            templateUrl:"admin/partial/edit/edit_a_url_ctrl.html",
            controller:"edit_a_url_ctrl",
            backdrop:"static",
            resolve:{
                a:function ()
                {
                    return angular.copy({type:type,url:url});
                }
            }
        });

        modal.result.then(function (re)
        {
            $scope.modify_a_url(re);
        },function (re)
        {
            console.log(re);
        })
    }

    $scope.modify_a_url=function (nav_item)
    {
        let a=$scope.edit.item;
        let a_e=edit_box.find($scope.edit.item_id);
        let type=a.attr("data-a-type");

        if(type=='href')
        {
            a.removeAttr("href");
            a_e.removeAttr("href");
        }
        else if(type=='sref')
        {
            a.removeAttr("ui-sref");
            a_e.removeAttr("ui-sref");
        }
        else if(type=='data')
        {
            a.removeAttr("ng-href");
            a_e.removeAttr("ng-href");
        }

        if(nav_item.type=='sref')
        {
            a.attr("ui-sref",nav_item.url);
            a_e.attr("ui-sref",nav_item.url);
        }
        else if(nav_item.type=='href')
        {
            a.attr("href",nav_item.url);
            a_e.attr("href",nav_item.url);
        }
        else if(nav_item.type=='data')
        {
            a.attr("ng-href","{{"+nav_item.url+"}}")
            a_e.attr("ng-href","{{"+nav_item.url+"}}")
        }
    }

    $scope.add_movie=function ()
    {
        let modal=$uibModal.open({
            templateUrl:"admin/partial/edit/add_movie_ctrl.html",
            controller:"add_movie_ctrl",
            backdrop:"static",
        })

        modal.result.then(function (movie)
        {
            $scope.create_movie(movie);
        },function () {})
    }

    $scope.create_movie=function (movie)
    {
        let temp=``;
        let uuid=uuid2.newid();
        if(movie.type=="out"||movie.type=="upload")
        {
            temp+=`<div id="${uuid}" name="${uuid}" style="width: 400px;height: 300px;" data-movie-type="${movie.type}"
                       my-video video-src="${movie.src}" video-type="${movie.videoType}"  ac-edit data-dom-type="movie">`;
        }
        else
        {
            temp+=`<div id="${uuid}" name="${uuid}"  my-video  my-src="${movie.src}" video-type="${movie.videoType}"
                      data-movie-type="${movie.type}"   style="width: 400px;height: 300px;"    ac-edit data-dom-type="movie-data">`
        }

        temp+=`</div>`;

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

    $scope.add_table=function ()
    {
        alert("该功能未完成");
    }

    $scope.add_ul=function ()
    {
        alert("该功能未完成");
    }

    $scope.add_repeat=function ()
    {
        alert("该功能未完成");
    }

    $scope.add_page=function ()
    {
        alert("该功能未完成");
    }

    $scope.edit_document_p=function ()
    {
        let doc=$scope.edit.item.html();

        let modal=$uibModal.open({
            templateUrl:"admin/partial/edit/edit_document_p.html",
            controller:"edit_document_p",
            backdrop:"static",
            resolve:{
                doc:function () {
                    return angular.copy(doc);
                }
            }
        })

        modal.result.then(function (doc) {
            $scope.modify_doc_p(doc)
        },function () {

        })
    }

    $scope.modify_doc_p=function (doc)
    {
        let d=HtmlUtil.toSafeHtml(doc);
        $scope.edit.item.html(d);
        edit_box.find($scope.edit.item_id).html(d);
    }

    $scope.edit_document_data=function ()
    {
        let data=$scope.edit.item.attr("data-document-data");
        let modal=$uibModal.open({
            backdrop:"static",
            templateUrl:"admin/partial/edit/edit_document_data.html",
            controller:"edit_document_data",
            resolve:{
                data:function ()
                {
                    return angular.copy(data);
                }
            }
        })

        modal.result.then(function (data)
        {
            $scope.modify_doc_data(data);
        },function () {

        })
    }

    $scope.modify_doc_data=function (data)
    {
        let safe=HtmlUtil.toSafeHtml(data);
        $scope.edit.item.attr("data-document-data",safe);
        let h=`{{${safe}|to_trusted}}`;
        $scope.edit.item.html(h);
        let e= edit_box.find($scope.edit.item_id);
        e.html(h);
        e.attr("data-document-data",safe);
    }

    $scope.edit_movie_ctrl=function ()
    {
        let movie={};
        movie.type=$scope.edit.item.attr("data-movie-type");
        if(movie.type=='out'||movie.type=='upload')
        {
            movie.src=$scope.edit.item.attr("video-src");
        }
        else if(movie.type=='data')
        {
            movie.src=$scope.edit.item.attr("my-src");
        }
        movie.videoType=$scope.edit.item.attr("video-type");
        let modal=$uibModal.open({
            templateUrl:"admin/partial/edit/edit_movie_ctrl.html",
            controller:"edit_movie_ctrl",
            backdrop:"static",
            resolve:{
                movie:function ()
                {
                    return angular.copy(movie);
                }
            }
        })

        modal.result.then(function (re)
        {
            $scope.modify_movie_src(re);
        },function () {})
    }

    $scope.modify_movie_src=function (movie)
    {
        let ele=edit_box.find($scope.edit.item_id);

        $scope.edit.item.attr("data-movie-type",movie.type);
        ele.attr("data-movie-type",movie.type);
        $scope.edit.item.attr("video-type",movie.videoType);
        ele.attr("video-type",movie.videoType);

        if(movie.type=='out'||movie.type=='upload')
        {
            $scope.edit.item.attr("video-src",movie.src);
            ele.attr("video-src",movie.src);
            $scope.edit.item.attr("data-dom-type","movie");
            ele.attr("data-dom-type","movie");
        }
        else if(movie.type=="data")
        {
            $scope.edit.item.attr("my-src",movie.src);
            ele.edit.item.attr("my-src",movie.src);
            $scope.edit.item.attr("data-dom-type","movie-data");
            ele.attr("data-dom-type","movie-data");
        }

    }

    $scope.add_carousel=function ()
    {
        let modal=$uibModal.open({
            backdrop:"static",
            size:"lg",
            templateUrl:"admin/partial/edit/add_carousel_ctrl.html",
            controller:"add_carousel_ctrl"
        });

        modal.result.then(function (re)
        {
            $scope.create_carousel(re);
        },function () {})
    }
    $scope.create_carousel=function (pic)
    {
        let uuid=uuid2.newid();
        $scope.pic[uuid]=pic;
        let json=angular.toJson({
            show:$scope.show,
            getdata:$scope.getdata,
            pic:$scope.pic
        })
        $("#json").html(json);
        let temp=``;

        temp+=`
<div name="${uuid}" id="${uuid}" data-dom-type="carousel"  ac-edit
        style="width: 300px;height: 200px;" my-carousel my-src="pic['${uuid}']">

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


    $scope.edit_carousel=function ()
    {
        let modal=$uibModal.open({
            controller:"edit_carousel_ctrl",
            templateUrl:"admin/partial/edit/edit_carousel_ctrl.html",
            backdrop:"static",
            size:"lg",
            resolve:{
                pic:function ()
                {
                     return angular.copy($scope.pic[$scope.edit.id]);
                }
            }
        })

        modal.result.then(function (re)
        {
            $scope.modify_carousel(re);
        },function ()
        {

        })
    }

    $scope.modify_carousel=function (pic)
    {
        $scope.pic[$scope.edit.id]=pic;

        let json=angular.toJson({
            show:$scope.show,
            getdata:$scope.getdata,
            pic:$scope.pic,
        })

        $("#json").html(json);
    }
});
app.controller("edit_carousel_ctrl",function ($scope,$uibModalInstance,Upload,pic)
{
    $scope.state='show';
    $scope.pic=pic;
    $scope.step=1;
    $scope.data={
        file:null
    }
    $scope.pic_type="";
    $scope.pic_img="";
    $scope.pic_text="";

    $scope.cancel=function ()
    {
        $uibModalInstance.dismiss("cancel");
    }

    $scope.next=function (type)
    {
        $scope.pic_type=type;
        $scope.step=2;
    }

    $scope.del_img=function (index,img)
    {
        if($scope.pic[index]==img)
        {
            $scope.pic.splice(index,1);
        }
    }

    $scope.add_img=function ()
    {
        if($scope.pic_type=='upload')
        {
            if (!$scope.data.file) {
                return;
            }
            $scope.upload=true;
            Upload.upload({
                url:"manage/upload",
                data:$scope.data,
            }).success(function (res) {
                if(res.status)
                {
                    $scope.pic.push({type:$scope.pic_type,image:res.data,text:$scope.pic_text});
                    $scope.pic_img="";
                    $scope.pic_text="";
                    $scope.pic_type="";
                    $scope.state="show";
                    $scope.step=1;
                    $scope.data={
                        file:null
                    }
                }
                else
                {
                    $scope.upload=false;
                    alert(res.message);
                }
            }).error(function (error) {
                console.log('error',error);
            });
        }
        else if($scope.pic_type=='out'||$scope.pic_type=='data')
        {
            $scope.pic.push({type:$scope.pic_type,image:$scope.pic_img,text:$scope.pic_text});
            $scope.pic_img="";
            $scope.pic_text="";
            $scope.pic_type="";
            $scope.state="show";
            $scope.step=1;
        }
    }

    $scope.ok=function ()
    {
        $uibModalInstance.close($scope.pic);
    }
})
app.controller("add_carousel_ctrl",function ($scope,$uibModalInstance,Upload)
{
    $scope.state='show';
    $scope.pic=[];
    $scope.step=1;
    $scope.data={
        file:null
    }
    $scope.pic_type="";
    $scope.pic_img="";
    $scope.pic_text="";

    $scope.cancel=function ()
    {
        $uibModalInstance.dismiss("cancel");
    }

    $scope.next=function (type)
    {
        $scope.pic_type=type;
        $scope.step=2;
    }

    $scope.del_img=function (index,img)
    {
        if($scope.pic[index]==img)
        {
            $scope.pic.splice(index,1);
        }
    }

    $scope.add_img=function ()
    {
        if($scope.pic_type=='upload')
        {
            if (!$scope.data.file) {
                return;
            }
            $scope.upload=true;
            Upload.upload({
                url:"manage/upload",
                data:$scope.data,
            }).success(function (res) {
                if(res.status)
                {
                    $scope.pic.push({type:$scope.pic_type,image:res.data,text:$scope.pic_text});
                    $scope.pic_img="";
                    $scope.pic_text="";
                    $scope.pic_type="";
                    $scope.state="show";
                    $scope.step=1;
                    $scope.data={
                        file:null
                    }
                }
                else
                {
                    $scope.upload=false;
                    alert(res.message);
                }
            }).error(function (error) {
                console.log('error',error);
            });
        }
        else if($scope.pic_type=='out'||$scope.pic_type=='data')
        {
            $scope.pic.push({type:$scope.pic_type,image:$scope.pic_img,text:$scope.pic_text});
            $scope.pic_img="";
            $scope.pic_text="";
            $scope.pic_type="";
            $scope.state="show";
            $scope.step=1;
        }
    }

    $scope.ok=function ()
    {
        $uibModalInstance.close($scope.pic);
    }
})
app.controller("edit_movie_ctrl",function ($scope, $uibModalInstance, Upload, movie)
{
    $scope.movie=movie;

    $scope.cancel=function ()
    {
        $uibModalInstance.dismiss("cancel");
    }

    $scope.change=function (type)
    {
        $scope.movie.type=type;
    }

    $scope.ok=function ()
    {
        if($scope.movie.type=='upload')
        {
            if (!$scope.data.file) {
                return;
            }
            $scope.upload=true;
            $scope.upbtn=true;
            Upload.upload({
                url:"manage/upload",
                data:$scope.data,
            }).success(function (res) {
                if(res.status)
                {
                    $uibModalInstance.close({type:$scope.movie.type,src:res.data,videoType:$scope.movie.videoType});
                }
                else
                {
                    $scope.upload=false;
                    alert(res.message);
                }
            }).error(function (error) {
                console.log('error',error);
                $scope.upbtn=false;
            });
        }
        else if($scope.movie.type=='out'||$scope.movie.type=='data')
        {
            $uibModalInstance.close($scope.movie);
        }
    }
})
app.controller("add_movie_ctrl",function ($scope,$uibModalInstance,Upload)
{
    $scope.state=1;
    $scope.type="";
    $scope.movie_video="";
    $scope.movie_type="";
    $scope.data = {
        file: null
    };
    $scope.upload=false;
    $scope.cancel=function () {
        $uibModalInstance.dismiss("cancel");
    }

    $scope.next=function (type)
    {
        $scope.type=type;
        $scope.state=2;
    }

    $scope.ok=function ()
    {
        if($scope.type=='upload')
        {
            if (!$scope.data.file) {
                return;
            }
            $scope.upload=true;
            $scope.upbtn=true;
            Upload.upload({
                url:"manage/upload",
                data:$scope.data,
            }).success(function (res) {
                if(res.status)
                {
                    $uibModalInstance.close({type:$scope.type,src:res.data,videoType:$scope.movie_type});
                }
                else
                {
                    $scope.upload=false;
                    alert(res.message);
                }
            }).error(function (error) {
                console.log('error',error);
                $scope.upbtn=false;
            });
        }
        else if($scope.type=='out'||$scope.type=='data')
        {
            $uibModalInstance.close({type:$scope.type,src:$scope.movie_video,videoType:$scope.movie_type});
        }
    }
})
app.controller("edit_document_data",function ($scope,HtmlUtil,$uibModalInstance,data)
{
    $scope.data=data;

    $scope.cancel=function () {
        $uibModalInstance.dismiss("cancel");
    }

    $scope.ok=function ()
    {
        if($scope.data!="")
            $uibModalInstance.close(HtmlUtil.toSafeHtml($scope.data));
        else
            alert("数据不可为空");
    }


})
app.controller("edit_document_p",function ($scope,HtmlUtil,$uibModalInstance,doc)
{
    $scope.doc=doc;
    $scope.config={};
    $scope.cancel=function () {
        $uibModalInstance.dismiss("cancel");
    }

    $scope.ok=function ()
    {
        let doc=HtmlUtil.toSafeHtml($scope.doc);
        $uibModalInstance.close(doc);
    }
})
app.controller("api_data_ctrl",function ($scope,$uibModalInstance,api_data,$http)
{
    //TODO: 可附加$stateParams附带的参数 未完成
    $scope.api_data=api_data;
    $scope.state="show";
    $scope.show={};
    $scope.edit={
        show:"",
        url:"",
        module:"",
        api:"page",
        data:""
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
                    $scope.edit.url="api/"+$scope.edit.module+"/"+$scope.edit.api;

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
app.controller("add_layout_ctrl",function ($scope,$uibModalInstance)
{
    $scope.is_add=true;
    $scope.col_num=1;
    $scope.col=[];
    $scope.cancel=function ()
    {
        $uibModalInstance.dismiss("cancel");
    }

    $scope.col_change=function (ctrl)
    {
        if(ctrl=="+")
        {
            if($scope.col_num<12)
            {
                $scope.col_num++;
            }
        }
        else if(ctrl=="-")
        {
            if($scope.col_num>1)
            {
                $scope.col_num--;
            }
        }
    }

    $scope.col_remove=function (col)
    {
        $scope.col.splice(col,1);
    }
    $scope.add_col=function ()
    {
        let col="col-xs-"+$scope.col_num;
        $scope.col.push(col);
    }

    $scope.ok=function ()
    {
        $uibModalInstance.close({"row":$scope.is_add,"col":$scope.col});
    }
})
app.controller("add_p_ctrl",function ($scope,HtmlUtil,$uibModalInstance)
{
    $scope.p="";
    $scope.state=1;
    $scope.type="";

    $scope.next=function (type)
    {
        $scope.type=type;
        $scope.state=2;
    }
    $scope.cancel=function ()
    {
        $uibModalInstance.dismiss("cancel");
    }

    $scope.ok=function ()
    {
       let p=HtmlUtil.htmlEncodeByRegExp($scope.p);

       if(p!="")
       {
           $uibModalInstance.close({p:p,type:$scope.type});
       }
       else
       {
           alert("不能添加空文本")
       }
    }
})
app.controller("add_document_ctrl",function ($scope, HtmlUtil, $uibModalInstance)
{
    $scope.doc="";
    $scope.docx="";
    $scope.config={};
    $scope.state=1;
    $scope.type="";

    $scope.cancel=function () {
        $uibModalInstance.dismiss("cancel");
    }

    $scope.next=function (type)
    {
        $scope.type=type;
        $scope.state=2;
    }

    $scope.ok=function ()
    {
        if($scope.doc!=""&&$scope.docx!="")
        {
            alert("不可以添加空文本");
        }
        else
        {
            let doc="";
            if($scope.type=="data")
                doc=HtmlUtil.toSafeHtml($scope.doc);
            else
                doc=HtmlUtil.toSafeHtml($scope.docx);
            $uibModalInstance.close({document:doc,type:$scope.type});
        }
    }


})
app.controller("add_div_ctrl",function ($scope,$uibModalInstance)
{
    $scope.cancel=function ()
    {
        $uibModalInstance.dismiss("cancel");
    }

    $scope.edit_css={
        width:undefined,
        height:undefined,
        color:"#000000",
        "background-color":"#ffffff"
    };

    $scope.ok=function ()
    {
        $uibModalInstance.close($scope.edit_css);
    }
})
app.controller("add_a_ctrl",function ($scope,$uibModalInstance,$http,HtmlUtil)
{
    $scope.a={
        type:"sref",
        url:"",
        data:""
    }

    $scope.state=1;

    $scope.url="";
    $scope.params="";

    $scope.router={};

    $http.post("router/items",{})
        .success(function (result)
        {
            if(result.status)
            {
                $scope.router=result.data;
            }
        })


    $scope.cancel=function () {
        $uibModalInstance.dismiss("cancel")
    }


    $scope.ok=function ()
    {
        if($scope.a.type=='sref')
        {
            $scope.a.url=$scope.url+$scope.params;
        }
        $scope.a.data=HtmlUtil.htmlEncodeByRegExp($scope.a.data);
        $uibModalInstance.close($scope.a);
    }

    $scope.next=function (type)
    {
        $scope.a.type=type;
        $scope.state=2;
    }
})
app.controller("add_img_ctrl",function ($scope,$http,$uibModalInstance,Upload)
{
    $scope.state=1;
    $scope.type="";
    $scope.pic_img="";
    $scope.data = {
        file: null
    };
    $scope.upload=false;
    $scope.cancel=function () {
        $uibModalInstance.dismiss("cancel");
    }

    $scope.next=function (type)
    {
        $scope.type=type;
        $scope.state=2;
    }

    $scope.ok=function ()
    {
        if($scope.type=='upload')
        {
            if (!$scope.data.file) {
                return;
            }
            $scope.upload=true;
            Upload.upload({
                url:"manage/upload",
                data:$scope.data,
            }).success(function (res) {
                if(res.status)
                {
                    $uibModalInstance.close({type:$scope.type,src:res.data});
                }
                else
                {
                    $scope.upload=false;
                    alert(res.message);
                }
            }).error(function (error) {
                console.log('error',error);
            });
        }
        else if($scope.type=='out'||$scope.type=='data')
        {
            $uibModalInstance.close({type:$scope.type,src:$scope.pic_img});
        }
    }

})
app.controller("edit_nav_ctrl",function ($scope, $http, $uibModalInstance,HtmlUtil)
{
    $scope.state=1;
    $scope.a={
        type:"",
        url:"",
        data:""
    }
    $scope.url="";
    $scope.params="";

    $scope.router={};

    $http.post("router/items",{})
        .success(function (result)
        {
            if(result.status)
            {
                $scope.router=result.data;
            }
        })

    $scope.cancel=function ()
    {
        $uibModalInstance.dismiss("cancel");
    }

    //初始化的导航条只有一个按钮
    //通过编辑 添加按钮 指向不懂页面

    $scope.ok=function ()
    {
        if($scope.a.type=='sref')
        {
            $scope.a.url=$scope.url+$scope.params;
        }
        $scope.a.data=HtmlUtil.htmlEncodeByRegExp($scope.a.data);
        $uibModalInstance.close($scope.a);
    }

    $scope.next=function (type)
    {
        $scope.a.type=type;
        $scope.state=2;
    }

})
app.controller("edit_nav_item_ctrl",function ($http, $scope, HtmlUtil, $uibModalInstance,text)
{
    $scope.text=text;
    $scope.cancel=function ()
    {
        $uibModalInstance.dismiss("cancel");
    }

    $scope.ok=function ()
    {
        let text=HtmlUtil.htmlEncodeByRegExp($scope.text);
        $uibModalInstance.close(text);
    }
})
app.controller("edit_nav_url_ctrl",function ($scope,$http,$uibModalInstance,a)
{
    $scope.a=a;
    $scope.url="";
    $scope.params="";

    $scope.getup=function ()
    {
        let uu=$scope.a.url.split("({");

        $scope.url=uu[0];

        if(uu.hasOwnProperty(1))
        {
            $scope.params="({"+uu[1];
        }
    }

    $scope.getup();

    $scope.router={};

    $http.post("router/items",{})
        .success(function (result)
        {
            if(result.status)
            {
                $scope.router=result.data;
            }
        })

    $scope.cancel=function ()
    {
        $uibModalInstance.dismiss("cancel");
    }

    $scope.type=function (type)
    {
        if($scope.a.type=='sref')
        {
            $scope.a.url=$scope.url+$scope.params;
        }
        $scope.a.type=type;
    }

    $scope.ok=function ()
    {
        if($scope.a.type=='sref')
        {
            $scope.a.url=$scope.url+$scope.params;
        }
        $uibModalInstance.close($scope.a);
    }

})
app.controller("edit_a_data_ctrl",function ($scope,$http,$uibModalInstance,text,HtmlUtil)
{
    $scope.text=text;
    $scope.cancel=function ()
    {
        $uibModalInstance.dismiss("cancel");
    }
    $scope.ok=function ()
    {
        let text=HtmlUtil.htmlEncodeByRegExp($scope.text);
        $uibModalInstance.close(text);
    }
})
app.controller("edit_a_url_ctrl",function ($scope,$http,$uibModalInstance,a,HtmlUtil)
{
    $scope.a=a;
    $scope.url="";
    $scope.params="";

    $scope.getup=function ()
    {
        let uu=$scope.a.url.split("({");

        $scope.url=uu[0];

        if(uu.hasOwnProperty(1))
        {
            $scope.params="({"+uu[1];
        }
    }

    $scope.getup();

    $scope.router={};

    $http.post("router/items",{})
        .success(function (result)
        {
            if(result.status)
            {
                $scope.router=result.data;
            }
        })

    $scope.cancel=function ()
    {
        $uibModalInstance.dismiss("cancel");
    }

    $scope.type=function (type)
    {
        if($scope.a.type=='sref')
        {
            $scope.a.url=$scope.url+$scope.params;
        }
        $scope.a.type=type;
    }

    $scope.ok=function ()
    {
        if($scope.a.type=='sref')
        {
            $scope.a.url=$scope.url+$scope.params;
        }
        $uibModalInstance.close($scope.a);
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
app.directive("acColor",function ()
{
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
app.service("HtmlUtil",function ()
{
    this.htmlEncodeByRegExp=function (str)
    {
        let s = "";
        if(str.length == 0) return "";

        s = str;
        s = s.replace(/</g,"&lt;");
        s = s.replace(/>/g,"&gt;");

        return s;
    }

    this.htmlDecodeByRegExp=function (str)
    {
        let s = "";
        if(str.length == 0) return "";
        s = str.replace(/&amp;/g,"&");
        s = s.replace(/&lt;/g,"<");
        s = s.replace(/&gt;/g,">");
        s = s.replace(/&nbsp;/g," ");
        s = s.replace(/&#39;/g,"\'");
        s = s.replace(/&quot;/g,"\"");
        return s;
    }

    this.toSafeHtml=function (str)
    {
        let reg=/<script[^>]*>(.|\n)*?(?=<\/script>)<\/script>/gi ;
        let reg1=/<iframe[^>]*>(.|\n)*?(?=<\/iframe>)<\/iframe>/gi ;

        let s="";

        s=str.replace(reg,"");
        s=str. replace(reg1,"");
        return s;
    }
})
app.filter('to_trusted',
    ['$sce',
        function ($sce)
        {
            return function (text) {
                return $sce.trustAsHtml(text);
            }
        }
    ]
)
app.directive("myVideo",function ()
{
    return{
        template:`
<div style="width:100%;height:100%;background-color: black;position: relative;">
    <div style="color: #ffffff;position: absolute;top:calc( 50% - 35px );left:calc( 50% - 35px )">
        <i class="fa fa-play fa-5x" aria-hidden="true"></i>
    </div>        
</div>   
`
    }
})
app.directive("myCarousel",function ()
{
    return {
        scope:{
            mySrc:"=",
        },
        template:`
<uib-carousel active="0" interval="2000" no-wrap="false">
    <uib-slide ng-repeat="slide in mySrc track by $index" index="$index">
        <img ng-src="{{slide.image}}"  style="margin:auto;width: 100%;">
        <div class="carousel-caption">
            <p>{{slide.text}}</p>
        </div>
    </uib-slide>
</uib-carousel>
`,
        controller:function ($scope,$attrs,$element,$transclude)
        {

        }
    }
})