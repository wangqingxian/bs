/**
 * Created by Administrator on 2017/4/11.
 */
angular.module("ac")
.directive("acColor",function ()
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
.service("HtmlUtil",function ()
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
.filter('to_trusted',
    ['$sce',
        function ($sce)
        {
            return function (text) {
                return $sce.trustAsHtml(text);
            }
        }
    ]
)
.directive("myVideo",function ()
{
    return  {
        scope:{
            mySrc:"=",
            videoSrc:"@",
            videoType:"@"
        },
        template:`
<div style="width:100%;height: 100%;margin: auto;overflow: hidden;">
    <videogular>
        <vg-media vg-src="resource"></vg-media>
        <vg-controls>
            <vg-play-pause-button></vg-play-pause-button>
            
            <vg-scrub-bar>
                <vg-scrub-bar-current-time></vg-scrub-bar-current-time>
            </vg-scrub-bar>
            
            <vg-volume>
                <vg-mute-button></vg-mute-button>
                <vg-volume-bar></vg-volume-bar>
            </vg-volume>
            <vg-fullscreen-button></vg-fullscreen-button>
        </vg-controls>
        <vg-overlay-play></vg-overlay-play>
    </videogular>
</div>
`,
        controller:function ($scope,$sce,$attrs,$element)
        {
            let src="";
            let t="";
            $scope.dataDomType=$attrs["domType"];
            if($scope.dataDomType=="movie-data")
            {
                src=$sce.trustAsResourceUrl($scope.mySrc);
                t=$scope.mySrc.split(".");
            }
            else if($scope.dataDomType=="movie")
            {
                src=$sce.trustAsResourceUrl($scope.videoSrc);
                t=$scope.videoSrc.split(".");
            }

            let type=angular.lowercase(t[t.length-1]);
            if($scope.videoType!=null&&$scope.videoType!=""&&$scope.videoType!=undefined)
                type=$scope.videoType;
            if(type=="mp4")
            {
                type="video/mp4";
                $scope.resource=[
                    {src:src,type:type}
                ]
            }
            else if(type=="webm")
            {
                type= "video/webm";
                $scope.resource=[
                    {src:src,type:type}
                ]
            }
            else if(type=="ogg")
            {
                type="video/ogg";
                $scope.resource=[
                    {src:src,type:type}
                ]
            }

        }
    }
})
.directive("myCarousel",function ()
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