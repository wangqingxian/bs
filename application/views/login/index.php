<div class="log" ng-controller="login">
    <form method="post">
        <div class="form-group">
            <label for="exampleInputEmail1">Email address</label>
            <input type="text" name="username" ng-model="username" id="username" class="form-control"  placeholder="username">
        </div>
        <div class="form-group">
            <label for="exampleInputPassword1">Password</label>
            <input type="password" class="form-control"  name="password" ng-model="password" id="password" placeholder="Password">
        </div>
        <div style="display: inline-block;">
            <button type="button" id="button" ng-click="login()" class="btn btn-default">Submit</button>
        </div>
        <div style="display: inline-block;color: #ca2424">
            {{message}}
        </div>
    </form>
</div>




