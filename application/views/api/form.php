<style>
    .api-form-table{
        width:100%;
    }
    .api-form-table>tbody>tr>td{
        vertical-align: middle;
        padding: 8px;
    }
    .edui-editor-body {
        height:150px;
        overflow-y: auto;
    }
</style>
<div class="row" ng-controller="<?=$controller?>">
    <div class="col-xs-12">
        <div style="float: left">
            <p style="font-size: 15px;font-weight: 600;"><?=$form_title?></p>
        </div>
        <div style="float: right">
            <a class="btn btn-default" ui-sref="module.api({module:<?=$module["module_id"]?>})">返回</a>
        </div>
    </div>
    <div class="col-xs-12">
        <table class="api-form-table" >
            <tr>
                <td width="20%"><?=$table["keys"][$table["primary"]]["key_name"]?></td>
                <td width="80%">
                    <?php if ($controller=="apiAdd"): ?>
                        自增主键，不可手动添加
                    <?php else: ?>
                        {{show.<?=$table["primary"]?>}}
                    <?php endif; ?>
                </td>
            </tr>
            <?php foreach ($table["keys"] as $item): ?>
                <?php if ($item["form"]!="primary"): ?>
                    <tr >
                        <td width="20%"><?=$item["key_name"]?></td>
                        <?php if ($item["form"]=="text"||$item["form"]=="textuniuqe"): ?>
                            <td width="80%">
                                <input type="text" class="form-control" name="<?=$item["key"]?>" ng-model="show.<?=$item["key"]?>">
                            </td>
                        <?php elseif ($item["form"]=="textarea"): ?>
                            <td width="80%" style="height: 150px">
                                <textarea name="<?=$item["key"]?>" class="form-control" style="width: 100%;height: 100%;"
                                          ng-model="show.<?=$item["key"]?>"></textarea>
                            </td>
                        <?php elseif ($item["form"]=="document"): ?>
                            <td width="80%" style="height: 150px;">
                                <div  style="width:100%;height:150px;margin:auto;" ng-model='show.<?=$item["key"]?>'
                                      meta-umeditor  meta-umeditor-config='config'></div>
                            </td>
                        <?php elseif($item["form"]=="number"||$item["form"]=="double"): ?>
                            <td width="80%">
                                <input type="number" name="<?=$item["key"]?>" ng-model="show.<?=$item["key"]?>">
                            </td>
                        <?php elseif($item["form"]=="datetime"): ?>
                            <td width="80%">
                                <div class="form-group col-xs-3" style="padding-left: 0;">
                                    <div class="input-group" >
                                        <input ng-model="show.<?=$item["key"]?>" is-open="TimeOpened['<?=$item['key']?>']"
                                               uib-datepicker-popup class="form-control htran-radius" readonly="readonly" style="height: 34px;"
                                               datepicker-options="dateOptions"  ng-required="false" show-button-bar="false"/>
                                        <span class="input-group-btn">
                                            <button type="button" class="btn btn-default" ng-click="openTime($event,<?php echo "'".$item["key"]."'"; ?>)"
                                                    style=" color: #1c7ff1;">
                                                <i class="glyphicon glyphicon-calendar"></i>
                                            </button>
                                        </span>
                                    </div>
                                </div>
                                <div class="col-xs-3" style="padding: 0;">
                                    <div class="col-xs-10 form-group " style="padding: 0;">
                                        <div class="input-group"  >
                                        <span class="input-group-btn">
                                            <button class="btn btn-default" ng-click="timeChange('hour','-','<?=$item['key']?>')" style=" color: #1c7ff1;">
                                                <i class="fa fa-minus" aria-hidden="true"></i>
                                            </button>
                                        </span>
                                            <span class="form-control" readonly >{{show.<?=$item["key"]?>|date:"HH"}}</span>
                                            <span class="input-group-btn">
                                            <button type="button" class="btn btn-default" ng-click="timeChange('hour','+','<?=$item['key']?>')" style=" color: #1c7ff1;">
                                                <i class="fa fa-plus" aria-hidden="true"></i>
                                            </button>
                                        </span>
                                        </div>
                                    </div>
                                    <div class="col-xs-2" style="padding: 0;line-height: 35px;">
                                        时
                                    </div>
                                </div>
                                <div class=" col-xs-3" style="padding: 0;">
                                    <div class="col-xs-10 form-group" style="padding: 0;">
                                        <div class="input-group " >
                                            <span class="input-group-btn">
                                                <button class="btn btn-default" ng-click="timeChange('minute','-','<?=$item['key']?>')" style=" color: #1c7ff1;">
                                                    <i class="fa fa-minus" aria-hidden="true"></i>
                                                </button>
                                            </span>
                                            <span class="form-control" readonly >{{show.<?=$item["key"]?>|date:"mm"}}</span>
                                            <span class="input-group-btn">
                                                <button type="button" class="btn btn-default" ng-click="timeChange('minute','+','<?=$item['key']?>')" style=" color: #1c7ff1;">
                                                    <i class="fa fa-plus" aria-hidden="true"></i>
                                                </button>
                                            </span>
                                        </div>
                                    </div>
                                    <div class="col-xs-2" style="padding: 0;line-height: 35px;">
                                        分
                                    </div>
                                </div>
                                <div class=" col-xs-3" style="padding-left: 0;">
                                    <div class="col-xs-10 form-group" style="padding: 0">
                                        <div class="input-group" >
                                        <span class="input-group-btn">
                                            <button class="btn btn-default" ng-click="timeChange('second','-','<?=$item['key']?>')" style=" color: #1c7ff1;">
                                                <i class="fa fa-minus" aria-hidden="true"></i>
                                            </button>
                                        </span>
                                            <span class="form-control" readonly >{{show.<?=$item["key"]?>|date:"ss"}}</span>
                                            <span class="input-group-btn">
                                            <button type="button" class="btn btn-default" ng-click="timeChange('second','+','<?=$item['key']?>')" style=" color: #1c7ff1;">
                                                <i class="fa fa-plus" aria-hidden="true"></i>
                                            </button>
                                        </span>
                                        </div>
                                    </div>
                                    <div class="col-xs-2" style="padding: 0;line-height: 35px;">
                                        秒
                                    </div>
                                </div>
                            </td>
                        <?php elseif($item["form"]=="tinyint"): ?>
                            <td>
                                <button class="btn btn-default" ng-click="show.<?=$item["key"]?>=true"
                                        ng-class=" { true:'btn-success',false: 'btn-default'}[show.<?=$item["key"]?>]">是</button>
                                <button class="btn btn-default" ng-click="show.<?=$item["key"]?>=false"
                                        ng-class=" { false:'btn-success',true: 'btn-default'}[show.<?=$item["key"]?>]">否</button>
                            </td>
                        <?php elseif($item["form"]=="upload"): ?>
                            <td >
                               <?php if ($controller=="apiModify"): ?>
                                   <div class="form-control" ng-if="show.<?=$item["key"]?>==undefined||show.<?=$item["key"]?>==''">
                                       <span ng-if="show.<?=$item["key"]?>!=''">{{modifyData.<?=$item["key"]?>}}</span>
                                       <button class="pull-right btn btn-xs" title="撤销" ng-click="show.<?=$item["key"]?>=undefined"><i class="fa fa-reply" aria-hidden="true"></i></button>
                                       <button class="pull-right btn btn-xs" title="删除" ng-click="show.<?=$item["key"]?>=''"><i class="fa fa-times" aria-hidden="true"></i></button>
                                   </div>
                               <?php endif; ?>
                                <input type="file" class="form-control" style="padding: 4px;" ng-src="{{show.<?=$item["key"]?>.name}}"
                                       onchange='angular.element(this).scope().fileChanged(this,"<?=$item["key"]?>")'>
                            </td>
                        <?php else: ?>
                            <td width="80%">
                                <input type="text" name="<?=$item["key"]?>" ng-model="show.<?=$item["key"]?>">
                            </td>
                        <?php endif; ?>
                    </tr>
                <?php endif; ?>
            <?php endforeach; ?>
            <tr>
                <td colspan="2" style="text-align: right;">
                    <button class="btn btn-info" ng-click="action()">提交</button>
                    <a class="btn btn-default" ui-sref="module.api({module:<?=$module["module_id"]?>})">返回</a>
                </td>
            </tr>
        </table>
    </div>
    <div ng-style="uploading" style="display: none;position: absolute;width: 100%;height: 100%;z-index: 999999;
            background:url('admin/image/loading.gif') no-repeat fixed center;">
    </div>
</div>