<style>
    .table >tbody>tr>th,
    .table >tbody>tr>td{
        word-wrap:break-word;
    }
</style>
<div class="row" ng-controller="apiController">
<!--    <p>apiController是在appBaseController.js里</p>-->
    <div class="col-xs-12">
        <p style="font-size: 15px;font-weight: 600;">
        <?php if (isset($module)): ?>
            <?=$module["module_name"]?>模块&nbsp;
            <?=$module["module"]?>表
        <?php endif; ?>
        数据源管理
        </p>
    </div>
    <div class="col-xs-12" style="margin-bottom: 15px;">
        <form class="form-inline">
            <div class="form-group">
                <label>搜索:</label>
                <select class="form-control" ng-model="searchField">
                    <option value="">请选择所需搜索的字段</option>
                    <?php foreach ($table["keys"] as $item): ?>
                        <option value="<?=$item["key"]?>"><?=$item["key_name"]?></option>
                    <?php endforeach; ?>
                </select>

            </div>
            <div class="form-group">
                <label class="sr-only">搜索框</label>
                <input type="text" class="form-control htran-radius" ng-model="searchData"  />
            </div>
            <div class="form-group">
                <label class="sr-only">按钮组</label>
                <a class="btn btn-primary" ng-click="newsearch()" >查询</a>
                <a class="btn btn-primary" ng-click="clear()" >清除条件</a>
                <span style="margin-left: 30px;">
                <a class="btn btn-success" ng-click="add()">添加</a>
                <a class="btn btn-danger" ng-click="delete()" >删除</a>
                <a class="btn btn-info" ng-click="modify()">修改</a>
            </div>
            <div class="form-group pull-right">
                <a class="btn btn-default" ng-click="getdata()">刷新</a>
                <a class="btn btn-default" ng-click="back()">返回</a>
            </div>
        </form>
    </div>
    <div class="col-xs-12">
        <div class="table-responsive">
            <table class="table table-hover table-striped" style="margin-bottom: 0px;">
                <tbody>
                <tr ng-click="checkAll(allChecked,show)">
                    <th style="width: 50px;">
                        <input type="checkbox" ng-checked="allChecked"
                               ng-click="checkAll(allChecked,show,$event)">
                    </th>
                    <?php if (isset($name)&&isset($table)): ?>
                        <th style="max-width: 150px;min-width: 50px;"><?=$name[$table["primary"]]?></th>
                    <?php endif; ?>
                    <?php if(isset($name)&&isset($table)) foreach ($name as $key=>$value): ?>
                        <?php if ($key!=$table['primary']): ?>
                            <th style="min-width: 50px;max-width: 150px;"><?=$value?></th>
                        <?php endif; ?>
                    <?php endforeach; ?>

                </tr>
                <tr ng-repeat="item in show " ng-click="checkSingle(item,show)">
                    <td>
                        <input type="checkbox" ng-checked="item.checked"
                               ng-click="checkSingle(item,show,$event)">
                    </td>
                    <?php if (isset($name)&&isset($table)): ?>
                        <td>{{item.<?=$table["primary"]?>}}</td>
                    <?php endif; ?>
                    <?php if(isset($name)&&isset($table)) foreach ($name as $key=>$value): ?>
                        <?php if ($key!=$table["primary"]): ?>
                            <td >{{item.<?=$key?>}}</td>
                        <?php endif; ?>
                    <?php endforeach; ?>
                </tr>
                </tbody>
            </table>
        </div>

        <uib-pagination total-items="dataSize" ng-model="model.pageNum"
                        boundary-link-numbers="true"
                        class="pagination-sm"	boundary-links="true"
                        previous-text="上一页" next-text="下一页" first-text="首页"
                        last-text="末页" max-size="3" ng-change="changePage()" style="margin: 0px;"	>
        </uib-pagination>
    </div>
</div>