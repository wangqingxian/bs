
<div ng-app="ac" class="container-fluid" style="height: 100%;" ng-controller="rootController">
    <div class="row" style="height: 100%">
        <div style="position: fixed;left: 0;top: 0;height: calc(99.9%);width: 25%;overflow-y: auto;background-color: #d3d3d3;">
            <div ng-if="state=='index'">
                <table class="table">
                    <tr>
                        <td>可视化编辑</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>当前元素</td>
                        <td>{!edit.tagName!}</td>
                    </tr>
                    <tr>
                        <td>元素名称</td>
                        <td>{!edit.name!}</td>
                    </tr>
                    <tr>
                        <td>元素ID</td>
                        <td>{!edit.id!}</td>
                    </tr>
                    <tr>
                        <td>操作</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td><button ng-click="edit_css()" class="btn btn-info">修改css</button></td>
                        <td><button ng-click="edit_class()" class="btn btn-info">修改class</button></td>
                    </tr>
                    <tr>
                        <td><button ng-click="edit_save()" class="btn btn-info">保存模版</button></td>
                    </tr>
                </table>
            </div>
            <div ng-if="state=='css'">
                <table class="table">
                    <tr>
                        <td>修改css</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>当前元素</td>
                        <td>{!edit.tagName!}</td>
                    </tr>
                    <tr>
                        <td>元素名称</td>
                        <td>{!edit.name!}</td>
                    </tr>
                    <tr>
                        <td>元素ID</td>
                        <td>{!edit.id!}</td>
                    </tr>
                    <tr>
                        <td>CSS</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>宽度</td>
                        <td>
                            <div class="input-group">
                                <input type="number" class="form-control" ng-model="edit.css['width']">
                                <div class="input-group-addon" >px</div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>高度</td>
                        <td>
                            <div class="input-group">
                                <input type="number" class="form-control" ng-model="edit.css['height']">
                                <div class="input-group-addon" >px</div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>显示类型</td>
                        <td>
                            <select class="form-control" ng-model="edit.css['display']">
                                <option value="" style="display: none;" hidden disabled></option>
                                <option ng-repeat="item in select['display']" value="{!item!}">{!item!}</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td>鼠标样式</td>
                        <td>
                            <select class="form-control" ng-model="edit.css['cursor']">
                                <option value="" style="display: none;" hidden disabled></option>
                                <option ng-repeat="item in select['cursor']" value="{!item!}">{!item!}</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td>背景颜色</td>
                        <td><div ac-color class="font-color" colorpicker ng-model="edit.css['background-color']"></div></td>
                    </tr>
                    <tr>
                        <td>背景图片(未完成)</td>
                        <td><button class="btn btn-info">设置图片</button></td>
                    </tr>
                    <tr>
                        <td>背景位置</td>
                        <td>
                            <div class="col-xs-6" style="padding: 0;">
                                <div class="input-group">
                                    <div class="input-group-addon">x</div>
                                    <input type="number" class="form-control "
                                           ng-model="edit.css['background-position'][0]" />
                                    <div class="input-group-addon" >%</div>
                                </div>
                            </div>
                            <div class="col-xs-6" style="padding: 0;">
                                <div class="input-group">
                                    <div class="input-group-addon">y</div>
                                    <input type="number" class="form-control "
                                           ng-model="edit.css['background-position'][1]" />
                                    <div class="input-group-addon" >%</div>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>背景尺寸</td>
                        <td>
                            <div class="col-xs-6" style="padding: 0;">
                                <div class="input-group">
                                    <div class="input-group-addon">x</div>
                                    <input type="number" class="form-control "
                                           ng-model="edit.css['background-size'][0]" />
                                    <div class="input-group-addon" >%</div>
                                </div>
                            </div>
                            <div class="col-xs-6" style="padding: 0;">
                                <div class="input-group">
                                    <div class="input-group-addon">y</div>
                                    <input type="number" class="form-control "
                                           ng-model="edit.css['background-size'][1]" />
                                    <div class="input-group-addon" >%</div>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>背景是否滚动</td>
                        <td>
                            <select class="form-control" ng-model="edit.css['background-attachment']">
                                <option value="" style="display: none;" hidden disabled></option>
                                <option ng-repeat="item in select['background-attachment']" value="{!item!}">{!item!}</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td>背景重复方式</td>
                        <td>
                            <select class="form-control" ng-model="edit.css['background-repeat']">
                                <option value="" style="display: none;" hidden disabled></option>
                                <option ng-repeat="item in select['background-repeat']" value="{!item!}">{!item!}</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td>文本对齐方式</td>
                        <td>
                            <select class="form-control" ng-model="edit.css['text-align']">
                                <option value="" style="display: none;" hidden disabled></option>
                                <option ng-repeat="item in select['text-align']" value="{!item!}">{!item!}</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td>字体颜色</td>
                        <td><div ac-color class="font-color" colorpicker ng-model="edit.css['color']"></div></td>
                    </tr>
                    <tr>
                        <td>字体大小</td>
                        <td>
                            <div class="input-group">
                                <input type="number" class="form-control"
                                       ng-model="edit.css['font-size']" />
                                <div class="input-group-addon" >px</div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>字体粗细</td>
                        <td>
                            <select class="form-control" ng-model="edit.css['font-weight']">
                                <option value="" style="display: none;" hidden disabled></option>
                                <option ng-repeat="item in select['font-weight']" value="{!item!}">{!item!}</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td>上边框类型</td>
                        <td>
                            <select class="form-control" ng-model="edit.css['border-top-style']">
                                <option value="" style="display: none;" hidden disabled></option>
                                <option ng-repeat="item in select['border-style']" value="{!item!}">{!item!}</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td>上边框颜色</td>
                        <td><div ac-color class="font-color" colorpicker ng-model="edit.css['border-top-color']"></div></td>
                    </tr>
                    <tr>
                        <td>上边框粗细</td>
                        <td>
                            <div class="input-group">
                                <input type="number" class="form-control" ng-model="edit.css['border-top-width']">
                                <div class="input-group-addon" >px</div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>右边框类型</td>
                        <td>
                            <select class="form-control" ng-model="edit.css['border-right-style']">
                                <option value="" style="display: none;" hidden disabled></option>
                                <option ng-repeat="item in select['border-style']" value="{!item!}">{!item!}</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td>右边框颜色</td>
                        <td><div ac-color class="font-color" colorpicker ng-model="edit.css['border-right-color']"></td>
                    </tr>
                    <tr>
                        <td>右边框粗细</td>
                        <td>
                            <div class="input-group">
                                <input type="number" class="form-control" ng-model="edit.css['border-right-width']">
                                <div class="input-group-addon" >px</div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>下边框类型</td>
                        <td>
                            <select class="form-control" ng-model="edit.css['border-bottom-style']">
                                <option value="" style="display: none;" hidden disabled></option>
                                <option ng-repeat="item in select['border-style']" value="{!item!}">{!item!}</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td>下边框颜色</td>
                        <td><div ac-color class="font-color" colorpicker ng-model="edit.css['border-bottom-color']"></td>
                    </tr>
                    <tr>
                        <td>下边框粗细</td>
                        <td>
                            <div class="input-group">
                                <input type="number" class="form-control" ng-model="edit.css['border-bottom-width']">
                                <div class="input-group-addon" >px</div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>左边框类型</td>
                        <td>
                            <select class="form-control" ng-model="edit.css['border-left-style']">
                                <option value="" style="display: none;" hidden disabled></option>
                                <option ng-repeat="item in select['border-style']" value="{!item!}">{!item!}</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td>左边框颜色</td>
                        <td><div ac-color class="font-color" colorpicker ng-model="edit.css['border-left-color']"></td>
                    </tr>
                    <tr>
                        <td>左边框粗细</td>
                        <td>
                            <div class="input-group">
                                <input type="number" class="form-control" ng-model="edit.css['border-left-width']">
                                <div class="input-group-addon" >px</div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>左上边框圆角</td>
                        <td>
                            <div class="input-group">
                                <input type="number" class="form-control" ng-model="edit.css['border-top-left-radius']">
                                <div class="input-group-addon" >px</div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>右上边框圆角</td>
                        <td>
                            <div class="input-group">
                                <input type="number" class="form-control" ng-model="edit.css['border-top-right-radius']">
                                <div class="input-group-addon" >px</div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>左下边框圆角</td>
                        <td>
                            <div class="input-group">
                                <input type="number" class="form-control" ng-model="edit.css['border-bottom-left-radius']">
                                <div class="input-group-addon" >px</div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>右下边框圆角</td>
                        <td>
                            <div class="input-group">
                                <input type="number" class="form-control" ng-model="edit.css['border-bottom-right-radius']">
                                <div class="input-group-addon" >px</div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>列表样式</td>
                        <td>
                            <select class="form-control" ng-model="edit.css['list-style-type']">
                                <option value="" style="display: none;" hidden disabled></option>
                                <option ng-repeat="item in select['list-style-type']" value="{!item!}">{!item!}</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td>上外边距</td>
                        <td>
                            <div class="input-group">
                                <input type="number" class="form-control" ng-model="edit.css['margin-top']">
                                <div class="input-group-addon" >px</div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>右外边距</td>
                        <td>
                            <div class="input-group">
                                <input type="number" class="form-control" ng-model="edit.css['margin-right']">
                                <div class="input-group-addon" >px</div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>下外边距</td>
                        <td>
                            <div class="input-group">
                                <input type="number" class="form-control" ng-model="edit.css['margin-bottom']">
                                <div class="input-group-addon" >px</div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>左外边距</td>
                        <td>
                            <div class="input-group">
                                <input type="number" class="form-control" ng-model="edit.css['margin-left']">
                                <div class="input-group-addon" >px</div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>上内边距</td>
                        <td>
                            <div class="input-group">
                                <input type="number" class="form-control" ng-model="edit.css['padding-top']">
                                <div class="input-group-addon" >px</div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>右内边距</td>
                        <td>
                            <div class="input-group">
                                <input type="number" class="form-control" ng-model="edit.css['padding-right']">
                                <div class="input-group-addon" >px</div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>下内边距</td>
                        <td>
                            <div class="input-group">
                                <input type="number" class="form-control" ng-model="edit.css['padding-bottom']">
                                <div class="input-group-addon" >px</div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>左内边距</td>
                        <td>
                            <div class="input-group">
                                <input type="number" class="form-control" ng-model="edit.css['padding-left']">
                                <div class="input-group-addon" >px</div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>浮动方式</td>
                        <td>
                            <select class="form-control" ng-model="edit.css['float']">
                                <option value="" style="display: none;" hidden disabled></option>
                                <option ng-repeat="item in select['float']" value="{!item!}">{!item!}</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td>定位方式</td>
                        <td>
                            <select class="form-control" ng-model="edit.css['position']">
                                <option value="" style="display: none;" hidden disabled></option>
                                <option ng-repeat="item in select['position']" value="{!item!}">{!item!}</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td>上定位</td>
                        <td>
                            <div class="input-group">
                                <input type="number" class="form-control" ng-model="edit.css['top']">
                                <div class="input-group-addon" >px</div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>右定位</td>
                        <td>
                            <div class="input-group">
                                <input type="number" class="form-control" ng-model="edit.css['right']">
                                <div class="input-group-addon" >px</div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>下定位</td>
                        <td>
                            <div class="input-group">
                                <input type="number" class="form-control" ng-model="edit.css['bottom']">
                                <div class="input-group-addon" >px</div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>左定位</td>
                        <td>
                            <div class="input-group">
                                <input type="number" class="form-control" ng-model="edit.css['left']">
                                <div class="input-group-addon" >px</div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td><button ng-click="css_sure()" class="btn btn-info">确定</button></td>
                        <td><button ng-click="css_back()" class="btn btn-info">返回</button></td>
                    </tr>
                </table>
            </div>
            <div ng-if="state=='class'">
                <table class="table">
                    <tr>
                        <td>可视化编辑</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>当前元素</td>
                        <td>{!edit.tagName!}</td>
                    </tr>
                    <tr>
                        <td>元素名称</td>
                        <td>{!edit.name!}</td>
                    </tr>
                    <tr>
                        <td>元素ID</td>
                        <td>{!edit.id!}</td>
                    </tr>
                    <tr>
                        <td>操作</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td><button ng-click="edit_css()" class="btn btn-info">修改css</button></td>
                        <td><button ng-click="edit_class()" class="btn btn-info">修改class</button></td>
                    </tr>
                </table>
            </div>
        </div>
        <div class="col-xs-9 col-xs-offset-3"  style="padding: 20px 15px 15px 15px;height: calc(99.9%);overflow-y: auto;" >
            <div id="container" name="container" style="height: 100%;width:100% ;border: 1px solid #d3d3d3;padding: 10px;position: relative;background-color: white;">
                <?=$html?>
            </div>
        </div>
    </div>
</div>
<div style="display: none;" id="edit">
    <?=$html?>
</div>
<div style="display: none;" id="json">
    <?=$json?>
</div>

