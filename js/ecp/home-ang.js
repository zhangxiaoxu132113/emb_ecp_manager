/**
 * Created by mrwater on 16/3/14.
 */
var app = angular.module("homeApp",['ui.router','tm.pagination']);

app.config(["$stateProvider", "$urlRouterProvider", "$httpProvider", function($stateProvider, $urlRouterProvider, $httpProvider) {
    //
    // For any unmatched url, redirect to /state1
    //
    // Now set up the states
    $urlRouterProvider.otherwise("/index");

    $stateProvider
        .state('/index', {
            url: "/index",
            templateUrl: "skin/white/template/index-mainBody.html"
        })
        .state('activity', {
            url: "/activity",
            templateUrl: "skin/white/template/activity-module.html"
        });


}]);

app.controller("appCtrl",function($scope,$http) {

    /**显示登陆按钮*/
    $scope.showLoginFrame = function() {
        $('#loginFrameID').slideToggle('slow');
    }
    $scope.activityTopics = [];
    $http({
        url:"/ecp/topic/home/getActivitiTopic",
        method:"GET"
    })
        .success(function(data) {
            $scope.activityTopics = data;
            console.log(data);
            angular.forEach($scope.activityTopics, function(data,index,array){
                data.Body = data.Body.substr(0,120);
            });
        })
        .error(function(data) {

        });
})
/**导航栏控制器*/
app.controller("navigationController", function ($scope,$http) {

    /**
     * 对应导航栏的数据
     * @type {*[]}
     */
    $scope.navigations = [];

    //请求后台数据
    $http({
        url:'/ecp/module/getAllModules',
        method:'GET'
    }).success(function(data){
            $scope.navigations = data;
            console.log(data);
        }).error(function(data){
            //处理响应失败
            alert("响应失败！");
        });

});

//app.controller("activityTopicController",function($scope,$http) {
//    $scope.activityTopics = [];
//    $http({
//        url:"/ecp/topic/home/getActivitiTopic",
//        method:"GET"
//    })
//        .success(function(data) {
//            $scope.activityTopics = data;
//        })
//        .error(function(data) {
//
//    });
//});

/**活动帖子控制器*/
app.controller("activityController", function ($scope,$http) {

    console.log("in the activityController");
    //alert(1);
    $scope.topics = [];
    $scope.pages = 1;     //默认第一页为首页
    //  $scope.sumPages = 1;  //初始化总页数
    $scope.pageSize = 10;  //默认每页显示两条数据


    $scope.addTopic = function() {
        //先通过一个http请求,判断该用户是否
        $http({
            url:'/topic/add'
        })
            .success(function(data) {
                if (data == "authFailure") {
                    alert("请先登录,再操作!");
                    return;
                }
                window.location.href="/skin/white/jsp/post.jsp?module=activity";
            })
            .error(function (data) {

            });

    }


    //一定要写在$http的请求之前，因为$http请求中有用到这里的参数！
    $scope.paginationConf = {
        currentPage: 1, //默认当前页为第一页
        itemsPerPage: 10//表示每页显示多少条数据
        /*pagesLength: 3,
         perPageOptions: [1, 5, 10, 20],//用户自定义每页显示多少条记录
         rememberPerPage: 'perPageItems',
         onChange: function(){

         }*/
    };
    $scope.condition = "createdOn";//查询条件,默认按照条件来排序

    /**获取热门数据*/
    $scope.accessHotData = function (condition){
        $scope.condition = condition;
        accessData();
    }

    /**获取最新数据*/
    $scope.accessLatestData = function(condition){
        $scope.condition = condition;
        accessData();
    }

    /**请求后台数据的函数*/
    var accessData = function() {
        $http({
            //url:'/ecp/topic/getPagesTopics',
            url:'/ecp/topic/getTopicsOrderBy',
            params :{
                pages    :$scope.paginationConf.currentPage,
                pageSize :$scope.paginationConf.itemsPerPage,
                condition:$scope.condition
            },
            method:'GET'
        }).success(function(data){
                console.log(data.topics);
                $scope.topics = data.topics; //根据后台对json的封装

                //$scope.sumPage = Math.ceil(data.recordsAll/$scope.pageSize);
                $scope.paginationConf.totalItems = data.recordsAll;
            }).error(function(data){
                //处理响应失败
                alert("Toppic响应失败！");
            });
    }

    /**请求后台数据*/
    accessData();
    /***************************************************************
     当页码和页面记录数发生变化时监控后台查询
     如果把currentPage和itemsPerPage分开监控的话则会触发两次后台事件。
     ***************************************************************/
        //？？？？？？？？？？？？？？？
    $scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage',function(newValue,oldValue){
        //alert("新的值："+newValue+"之前的值："+oldValue);
        $http({
            url    :'/ecp/topic/getTopicsOrderBy',
            params :{
                pages    :$scope.paginationConf.currentPage,
                pageSize :$scope.paginationConf.itemsPerPage,
                condition:$scope.condition
            },
            method :'GET'
        }).success(function(data){
                $scope.topics = data.topics; //根据后台对json的封装
                //$scope.sumPage = Math.ceil(data.recordsAll/$scope.pageSize);
                $scope.paginationConf.totalItems = data.recordsAll;
            }).error(function(data){
                //处理响应失败
                alert("Toppic响应失败！");
            });

    });
});

