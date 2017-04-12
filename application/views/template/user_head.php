<!DOCTYPE html>
<html lang="en" ng-app="ac">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title><?=$ac_title?></title>
    <base href="<?=ROOTURL?>">
    <link rel="shortcut icon" href="<?=ADMIN_URL."image/icon.png"?>" >
    <!--css样式-->
    <link rel="stylesheet" href="<?=NPM?>bootstrap/dist/css/bootstrap.css">
    <link rel="stylesheet" href="<?=NPM?>font-awesome/css/font-awesome.css">
    <link rel="stylesheet" href="<?=ADMIN_CSS?>user.css">
    <link rel="stylesheet" href="<?=BOWER?>angular-ui-tree/dist/angular-ui-tree.css">
    <link rel="stylesheet" href="<?=NPM?>angular-bootstrap-colorpicker/css/colorpicker.min.css">
    <link rel="stylesheet" href="<?=NPM?>jquery-ui-dist/jquery-ui.css">
    <link rel="stylesheet" href="<?=NPM?>videogular-themes-default/videogular.css" >
    <!--js类库-->
    <script src="<?=NPM?>jquery/dist/jquery.js"></script>
    <script src="<?=NPM?>angular/angular.js"></script>
    <script src="<?=NPM?>angular-sanitize/angular-sanitize.js"></script>
    <script src="<?=NPM?>videogular/videogular.js"></script>
    <script src="<?=NPM?>videogular-controls/vg-controls.js"></script>
    <script src="<?=NPM?>videogular-overlay-play/vg-overlay-play.js"></script>
    <script src="<?=NPM?>videogular-buffering/vg-buffering.js"></script>
    <script src="<?=NPM?>jquery-ui-dist/jquery-ui.js"></script>
    <script src="<?=NPM?>echarts/dist/echarts.js"></script>
    <script src="<?=ADMIN_JS?>directive/angular-cgs-utils.js"></script>
    <script src="<?=NPM?>angular-animate/angular-animate.js"></script>
    <script src="<?=NPM?>angular-messages/angular-messages.js"></script>
    <script src="<?=NPM?>angular-ui-bootstrap/dist/ui-bootstrap-tpls.js"></script>
    <script src="<?=NPM?>angular-ui-router/release/angular-ui-router.js"></script>
    <script src="<?=NPM?>oclazyload/dist/oclazyLoad.js"></script>
    <script src="<?=BOWER?>ng-lodash/build/ng-lodash.js"></script>
    <script src="<?=BOWER?>angular-ui-tree/dist/angular-ui-tree.js"></script>
    <script src="<?=NPM?>kuitos-angular-utils/polyfills/ui-router-require-polyfill.js"></script>
    <script src="<?=NPM?>angular-i18n/angular-locale_zh.js"></script>
    <script src="<?=NPM?>ng-echarts/dist/ng-echarts.min.js"></script>
    <script src="<?=NPM?>angular-bootstrap-colorpicker/js/bootstrap-colorpicker-module.js"></script>

    <!--angular控制器等-->
    <script src="<?=USER_URL?>app.js"></script>
    <script src="<?=ADMIN_JS?>directive/user-directive.js"></script>
</head>
<body>
