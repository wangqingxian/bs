<div class="container-fluid" ng-controller="root" >
    <nav class="navbar navbar-default navbar-fixed-top">
        <div class="navbar-header">
            <a class="navbar-brand" style="margin-top: 12px;" href="<?=ROOTURL.'/manage'?>">
                <?php echo SITE_NAME?>
            </a>
        </div>
        <div id="navbar">
            <ul style="margin-right: 15px;" class="nav navbar-nav navbar-right navbar-icon-menu">
                <?php if (isset($menu)) foreach ($menu as $k => $v): ?>
                    <li>
                        <a ui-sref="<?php echo $v['sref'] ?>">
                            <i class="fa fa-<?php echo $v['icon'] ?>"></i>
                            <span><?php echo $v['name'] ?></span>
                        </a>
                    </li>
                <?php endforeach; ?>
            </ul>
        </div>
    </nav>
    <div class="row" style="margin-top: 80px;" ng-controller="loginCtrl">
        <div class="text-right pull-right" style="margin-right: 10px;">
            <i class="fa fa-user"></i>
            <?php
                    $user=$this->session->userdata("user_fullname")?:$this->session->userdata("user_name");
                    echo "<a ng-click='reload()'>".$user
                            ."[".$this->session->userdata("group_name")."]</a>，";
                    echo "<a href='logout'>Logout</a>";
            ?>
        </div>
    </div>
    <div class="row" style="margin-top: 10px;" ui-view>

    </div>
</div>
<script type="text/ng-template" id="nodes_renderer1.html">
    <div class="tree-node" ui-sref={{node.module_sref}}>
        <div class="tree-node-content noWrap">
            <a>{{node.module_name}}</a>
        </div>
    </div>
    <ol ui-tree-nodes="" ng-model="node.nodes" ng-class="{hidden: collapsed}">
        <li ng-repeat="node in node.nodes" ui-tree-node ng-include="'nodes_renderer1.html'">
        </li>
    </ol>
</script>
<script type="text/ng-template" id="nodes_renderer2.html">
    <div class="tree-node" ui-sref={{node.sref}}>
        <div class="tree-node-content noWrap">
            <a>{{node.title}}</a>
        </div>
    </div>
    <ol ui-tree-nodes="" ng-model="node.nodes" ng-class="{hidden: collapsed}">
        <li ng-repeat="node in node.nodes" ui-tree-node ng-include="'nodes_renderer2.html'">
        </li>
    </ol>
</script>
