<!DOCTYPE html>
<html lang="en" ng-app="ac">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title><?=$ac_tittle?></title>
    <link rel="shortcut icon" href="<?=ADMIN_URL."image/icon.png"?>" >
    <!--css样式-->
    <link rel="stylesheet" href="<?=NPM?>bootstrap/dist/css/bootstrap.css">
    <link rel="stylesheet" href="<?=NPM?>font-awesome/css/font-awesome.css">
    <?php if ($ac_page=='login'): ?>
        <link rel="stylesheet" href="<?=ADMIN_CSS?>login.css">
    <?php else: ?>
        <link rel="stylesheet" href="<?=ADMIN_CSS?>style.css">
        <link rel="stylesheet" href="<?=BOWER?>angular-ui-tree/dist/angular-ui-tree.css">
        <link type="text/css" rel="stylesheet" href="<?=ROOTURL?>/admin/umeditor/dist/utf8-php/themes/default/css/umeditor.css">
    <?php endif; ?>
    <!--js类库-->
    <script src="<?=NPM?>jquery/dist/jquery.js"></script>
    <script src="<?=ROOTURL?>admin/umeditor/dist/utf8-php/umeditor.js"></script>
    <script src="<?=ROOTURL?>admin/script/config/umeditor.config.js"></script>
    <script src="<?=NPM?>angular/angular.js"></script>
    <script src="<?=ADMIN_JS?>directive/angular-cgs-utils.js"></script>
    <?php if($ac_page!="login"): ?>
        <script src="<?=NPM?>angular-messages/angular-messages.js"></script>
        <script src="<?=NPM?>angular-animate/angular-animate.js"></script>
        <script src="<?=NPM?>angular-ui-bootstrap/dist/ui-bootstrap-tpls.js"></script>
        <script src="<?=NPM?>angular-ui-router/release/angular-ui-router.js"></script>
        <script src="<?=NPM?>oclazyload/dist/oclazyLoad.js"></script>
        <script src="<?=BOWER?>angular-ui-tree/dist/angular-ui-tree.js"></script>
        <script src="<?=NPM?>kuitos-angular-utils/polyfills/ui-router-require-polyfill.js"></script>
        <script src="<?=NPM?>angular-i18n/angular-locale_zh.js"></script>
        <script src="<?=NPM?>ng-echarts/dist/ng-echarts.min.js"></script>
        <script src="<?=BOWER?>meta.umeditor/src/meta.umeditor.js"></script>
    <?php endif; ?>
    <!--angular控制器等-->
    <?php if ($ac_page=="login"): ?>
        <script src="<?=ADMIN_JS?>login.js"></script>
    <?php else: ?>
        <script src="<?=ADMIN_JS?>controller/appBaseController.js"></script>
        <?php if(isset($script)) foreach ($script as $item): ?>
            <script src="<?=$item?>"></script>
        <?php endforeach; ?>
        <script src="<?=ADMIN_JS?>app.js"></script>
    <?php endif; ?>
</head>
<body>

