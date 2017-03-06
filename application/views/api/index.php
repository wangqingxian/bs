<div class="row" ng-controller="apiController">
    <div class="col-xs-12">
        <p style="font-size: 15px;font-weight: 600;">
        <?php if (isset($module)): ?>
            <?=$module["module"]?>模块
        <?php endif; ?>
        数据源管理
        </p>
    </div>
    <div class="col-xs-12" style="margin-bottom: 15px;">
        <form class="form-inline">
            <div class="form-group">
                <label class="sr-only">按钮组</label>
                <a class="btn btn-success" ng-click="add()">添加</a>
                <a class="btn btn-danger" ng-click="delete()" >删除</a>
                <a class="btn btn-info" ng-click="modify()">修改</a>
            </div>
            <div class="form-group pull-right">
                <a class="btn btn-default" ng-click="back()">返回</a>
            </div>
        </form>
    </div>
    <div class="col-xs-12">
        <table class="table table-hover table-striped" style="margin-bottom: 0px;">
            <tbody>
            <tr ng-click="checkAll(allChecked,show)">
                <th style="width: 50px;">
                    <input type="checkbox" ng-checked="allChecked"
                           ng-click="checkAll(allChecked,show,$event)">
                </th>
                <?php if(isset($name)&&isset($table)) foreach ($name as $key=>$value): ?>
                    <th><?=$value?></th>
                <?php endforeach; ?>

            </tr>
            <tr ng-repeat="item in show " ng-click="checkSingle(item,show)">
                <td>
                    <input type="checkbox" ng-checked="item.checked"
                           ng-click="checkSingle(item,show,$event)">
                </td>
                <?php if(isset($name)&&isset($table)) foreach ($name as $key=>$value): ?>
                    <td>{{item.<?=$key?>}}</td>
                <?php endforeach; ?>
            </tr>
            </tbody>
        </table>
        <uib-pagination total-items="dataSize" ng-model="model.pageNum"
                        boundary-link-numbers="true"
                        class="pagination-sm"	boundary-links="true"
                        previous-text="上一页" next-text="下一页" first-text="首页"
                        last-text="末页" max-size="3" ng-change="changePage()" style="margin: 0px;"	>
        </uib-pagination>
    </div>
</div>