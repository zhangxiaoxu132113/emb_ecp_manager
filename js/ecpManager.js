var app = angular.module("ecpManager",['ui.router','tm.pagination']);

app.config(["$stateProvider", "$urlRouterProvider", "$httpProvider", function($stateProvider, $urlRouterProvider, $httpProvider) {

    $urlRouterProvider.otherwise("/main");
    $stateProvider
        .state('main', {
            url: "/main", templateUrl: "../template/main.html"
        })
        .state('examineOT', {
            url: "/examineOT", templateUrl: "../template/topicManager/examineOT.html"
        })
        .state('examineOA', {
            url: "/examineOA", templateUrl: "../template/topicManager/examineOA.html"
        })
        .state('examineOE', {
            url: "/examineOE", templateUrl: "../template/topicManager/examineOE.html"
        })
        .state('examineOD', {
            url: "/examineOD", templateUrl: "../template/topicManager/examineOD.html"
        })
        .state('messageO', {
            url: "/messageO", templateUrl: "../template/message/messageO.html"
        })
        .state('messageA', {
            url: "/messageA", templateUrl: "../template/message/messageA.html"
        })
        .state('activeModule', {
            url: "/activeModule", templateUrl: "../template/module/activeModule.html"
        })
        .state('interestModule', {
            url: "/interestModule", templateUrl: "../template/module/interestModule.html"
        })
        .state('picModule', {
            url: "/picModule", templateUrl: "../template/module/picModule.html"
        })
        .state('addUser', {
            url: "/addUser", templateUrl: "../template/userManager/addUser.html"
        })
        .state('editUser', {
            url: "/editUser", templateUrl: "../template/userManager/editUser.html"
        })
        .state('detailUser', {
            url: "/detailUser", templateUrl: "../template/userManager/detailUser.html"
        })


}]);

app.controller("mainCtrl",function($scope,$http){
    $scope.topic = {
        id:34,
        name:'zhangmiaojie'
    }

});


/*jquery operator !*/
$(".op-list-level-one").each(function(){
    /*给一级菜单添加点击事件*/
    $(this).bind('click',function(){
        $(this).next().slideToggle(800);
    });
    /*给二级菜单添加点击事件*/
    $(".op-list").find("ul > li > a").bind('click',function(){
        $("html body").animate({scrollTop:0},'fast');
        $(".home-op-list > a").removeClass("menu-active");
        $(".op-list").find("ul > li > a").each(function(){
            $(this).removeClass("menu-active");
        });
        $(this).addClass("menu-active");
    });
});

$(".home-op-list > a").click(function(){
    $("html body").animate({scrollTop:0},'fast');
    $(this).addClass("menu-active");
    $(".op-list").find("ul > li > a").each(function(){
        $(this).removeClass("menu-active");
    });
});

/**/
var $navBarH = 50;  //顶部栏的高度 - 固定
var lucencyV = 1.0; //透明度
$(window).scroll(function(){
    if(window.pageYOffset > $navBarH) {
        $(".navbar.main").css("background","rgba(255, 255, 255, 0.85)");
        lucencyV = 1.0;
    } else if (window.pageYOffset == 0){
        $(".navbar.main").css("background","rgba(255, 255, 255, 1.0)");
        lucencyV = 1.0;
    } else {
        lucencyV -= 0.003;
        //console.log("lucency Value = "+lucencyV);
        $(".navbar.main").css("background","rgba(255, 255, 255, "+lucencyV+")");
    }
});









