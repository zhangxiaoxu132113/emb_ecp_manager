var app = angular.module('personHomeApp',['ui.router','tm.pagination']);
var websocket;

//初始话WebSocket
var messageCount = 0;
function initWebSocket() {
    if (window.WebSocket) {
        websocket = new WebSocket(encodeURI('ws://localhost:8080/message'));
        websocket.onopen = function() {
            //连接成功
            console.log("已连接");
        }
        websocket.onerror = function() {
            //连接失败
            console.log("连接出现错误");
        }
        websocket.onclose = function() {
            //连接断开
            console.log("链接已经断开");
        }
        //消息接收
        websocket.onmessage = function(messageData) {
            var message = messageData.data;
            //var length = message.length;
            //$('#ecp-message-count').html(length);
            //console.log(message.length);
            //if (message.headImage != "") {
            //    messageCount ++;
            //    $('#ecp-message-count').html("("+messageCount+")");
            //}

            console.log("从服务端接收到信息:"+message);
        }
    }
};
//建立webSocket连接
initWebSocket();

//发送消息给服务器端
app.config(["$stateProvider", "$urlRouterProvider", "$httpProvider",
    function($stateProvider, $urlRouterProvider, $httpProvider) {

        $urlRouterProvider.otherwise("/latestTopic");
        $stateProvider
            .state('latestTopic', {
                url        : "/latestTopic",
                templateUrl: "/skin/white/template/personHome-activity.html"
            })
            .state('myTopicList', {
                url        : "/myTopicList",
                templateUrl: "/skin/white/template/user-topicList.html"
            });

    }]);
app.filter('trustHtml', function ($sce) {
    return function (input) {
        return $sce.trustAsHtml(input);
    }
});

var format = function (time, format){
    var t = new Date(time);
    var tf = function(i){return (i < 10 ? '0' : '') + i};
    return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a){
        switch(a){
            case 'yyyy':
                return tf(t.getFullYear());
                break;
            case 'MM':
                return tf(t.getMonth() + 1);
                break;
            case 'mm':
                return tf(t.getMinutes());
                break;
            case 'dd':
                return tf(t.getDate());
                break;
            case 'HH':
                return tf(t.getHours());
                break;
            case 'ss':
                return tf(t.getSeconds());
                break;
        }
    })
};

//获取该当页面处于哪一个路由中
var hrefStr = window.location.href;
var arr = new Array();
arr = hrefStr.split("#/");
var currentRoute = arr[1];
if (currentRoute == "latestTopic") {
    $("#myTopicList").removeClass('active');
    $("#myTopicList").find("a").each(function(){
        $(this).removeClass('ecp-personHome-navigation-activity');
    });

    $("#latestTopic").attr('class','active ');
    $("#latestTopic").find("a").each(function(){
        $(this).attr('class','ecp-personHome-navigation-activity');
    });
} else if (currentRoute == "myTopicList") {
    $("#myTopicList").attr('class','active ');
    $("#myTopicList").find("a").each(function(){
        $(this).attr('class','ecp-personHome-navigation-activity');
    });

    $("#latestTopic").removeClass('active');
    $("#latestTopic").find("a").each(function(){
        $(this).removeClass('ecp-personHome-navigation-activity');
    });
}


/*用户控制器*/
app.controller('userController',function($scope,$http){
    //用于对象
    $scope.user = {};
    /**请求用户数据*/
    var getUserInfo = function() {
        $http({
            url:'/rest/userController/getUser/'+$('#friendId').val(),
            method:'GET'
        }).success(function(data){
                console.log(data);
                $scope.user = data;
            }).error(function(data){
                //处理响应失败
                alert("响应失败！");
            });
    }
    getUserInfo();

    /**显示登陆模态窗口*/
    $scope.showLoginFrame = function() {

        $('#loginFrameID').slideToggle('slow');
    }
});

/*帖子控制器*/
app.controller('topicController',function($scope,$http,$log){

    $scope.topics = [];
    $scope.myTopics = [];
    $scope.userReply = {};

    var userId = $('#userId').val();
    var friendId = $('#friendId').val();
    //根据用户id获取用户发的帖子
    var accessTopicsByUserId = function(userIdp,friendIdp) {
        var userId = userIdp;
        var friendId = friendIdp;

        if ( userId != friendId ) {
            userId = friendId;
        }
        $http({
            url:'/ecp/topic/getTopicsByUser/'+userId,
            method:'GET'
        }).success(function(data){
                $log.info(data);
                $scope.topics = data;
                angular.forEach($scope.topics, function(data,index,array){
                    data.CreatedOn = format(data.CreatedOn,'yyyy-MM-dd HH:mm:ss');
                    if (data.replies != undefined) {
                        for (var i=0; i<data.replies.length; i++) {
                            data.replies[i].CreatedOn  = format(data.replies[i].CreatedOn,'yyyy-MM-dd HH:mm:ss');
                        }
                    }

                });
            }).error(function(data){
                console.log("响应失败！");
            });
    }
    accessTopicsByUserId(userId,friendId);

    //var dropReplyFrame = false;
    var dropReplyFrameId = -1;
    var dropFaceBoxID = -1;  //表情下拉框对应的id
    var dropFaceBoxFlag = false; //表情下拉框是否点击

    /**显示回复框*/
    $scope.showReplyFrame = function(topicID){
        if (dropReplyFrameId == -1) {
            dropReplyFrameId = topicID;
            dropFaceBoxID = topicID;
        }
        var replyFrameID = "replyFrame" + dropReplyFrameId;
        var faceBoxId = "face_box"+dropFaceBoxID;
        var newReplyFrameID = "replyFrame" + topicID;
        if (dropReplyFrameId == topicID) { //用户点击的是同一个按钮
            $('#'+replyFrameID).slideToggle();
        } else {//如果用户再点击了一个评论跟帖的按钮,则将原来的隐藏,显示新的回复框
            //将前一次点击显示的下拉框隐藏
            if (!$('#'+replyFrameID).is(":hidden"))
                $('#'+replyFrameID).slideToggle();
            if (dropFaceBoxFlag) {
                $('#'+faceBoxId).slideToggle();
                $('#'+faceBoxId).find("li").each(function(){
                    $(this).unbind('click');
                });
                dropFaceBoxFlag = !dropFaceBoxFlag;
            }
            //将新的下拉框显示出来
            $('#'+newReplyFrameID).slideToggle();
        }
        //将新的id赋值给dropReplyFrameId
        dropReplyFrameId = topicID;
        dropFaceBoxID = topicID;
    }

    /**显示表情包*/
    $scope.showFaceBox = function (topicID) {
        var replyContentID = "replyContent" + topicID;
        var faceBoxId = "face_box" + dropFaceBoxID;
        $('#'+faceBoxId).toggle("slow");//将隐藏的表情框显示出来
        //给图片按钮添加事件
        var faceBoxId = "face_box"+dropFaceBoxID;
        if (!dropFaceBoxFlag) {
            $('#'+faceBoxId).find("li").each(function(){
                $(this).bind('click',function(){
                    var img = $(this).find("img").clone();
                    $("#"+replyContentID).append(img);
                });
            });
        } else {
            $('#'+faceBoxId).find("li").each(function(){
                $(this).unbind('click');
            });
        }
        dropFaceBoxFlag = !dropFaceBoxFlag;
    }

    /**实现发表评论,id为文章的id*/
    $scope.sendMessage = function(id,createUserID) {
        var replyContentID = "replyContent" + id;
        var content = $('#'+replyContentID).html();
        //定义reply对象
        var reply = {};
        //验证的方法不够完善
        if(content == null || content == "") {
            alert("内容不能为空!");
            return;
        }
        reply.topicId = id;
        reply.body = content;
        reply.userId = $('#userId').val();
        console.log("uerId = "+$('#userId').val());
        reply.modifiedOn = new Date();
        reply.createdOn = new Date();
        console.log(reply);
        $http({
            url:'/ecp/topic/addReply',
            method:'POST',
            data:reply,
            headers: {'Content-type': 'application/json;charset=UTF-8'}
        })
            .success(function(data){
                if (data == "authFailure") {
                    alert("请先登录,再操作!");
                    return;
                }
                var headImage = $('#headImage').val();
                var nickName = $('#nickName').val();
                //添加评论成功后的操作
                //将回复框隐藏掉,并清空内容
                var replyFrameID = "replyFrame" + id;
                $('#'+replyFrameID).toggle();
                $('#'+replyContentID).text(" ");
                //让隐藏的div显示出来,并将新增的数据添加进去
                var replyShowID = "reply-show"+id;
                var topicReplyID = "ecp-personHome-topic-reply" + id;
                console.log("replyShowID = "+replyShowID);
                $('#'+replyShowID).attr("class", "ecp-personHome-topic-reply");
                $('#'+topicReplyID).append(
                    "<div class='row'>"+
                        "<div class='col-md-1'>"+
                        "<a href='/profile/"+reply.userId+"/home'><img src='"+headImage+"' style='border:2px solid #fff' class='img-circle' width='56' height='56'></a><br>"+
                        "</div>"+
                        "<div class='col-md-11' style='padding-left: 30px'>"+
                        "<a href='/profile/"+reply.userId+"/home'>"+nickName+"</a><br>"+
                        "<p style='margin-top: 10px;'>"+reply.body+"</p>"+
                        "<a class='pull-right ecp-personHome-reply' href='#'>回复</a>"+
                        "<span class='pull-right ecp-personHome-reply-date'>评论于 : <em>"+format(reply.createdOn.getTime(), 'yyyy-MM-dd HH:mm:ss')+"</em></span>"+
                        "</div>"+
                        "</div>"
                );
                //通过socket发送消息给服务器端,通知所有的用户
                var userId = $('#userId').val();
                var friendId = $('#friendId').val();
                if ( userId != friendId ) {
                    var message = {
                        "userId":reply.userId,
                        "body":reply.body,
                        "topicId":reply.topicId,
                        "createUserID":createUserID,
                        "createOn":reply.createdOn,
                        "headImage":headImage
                    };
                    if (websocket != null) {
                        websocket.send(JSON.stringify(message));
                    } else {
                        console.log("你的socket连接已经掉线了!");
                    }
                }

            })
            .error(function(data){
                console.log("保存失败");
            });
    }

    /*精华帖数据*/
    $scope.elitePosts = [];
    var accessElitePosts = function() {
        $http({
            url:'/ecp/topic/getElitePosts',
            method:'GET'
        })
            .success(function(data){
                console.log(data);
                $scope.elitePosts = data;
            })
            .error(function (data) {
                console.log("获取精华帖数据失败");
            });
    }
    accessElitePosts();

    $scope.pages = 1;     //默认第一页为首页
    $scope.pageSize = 10;  //默认每页显示两条数据

    //一定要写在$http的请求之前，因为$http请求中有用到这里的参数！
    $scope.paginationConf = {
        currentPage: 1, //默认当前页为第一页
        itemsPerPage: 10//表示每页显示多少条数据
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
        if ( userId != friendId ) {
            userId = friendId;
        }
        $http({
            //url:'/ecp/topic/getPagesTopics',
            url:'/ecp/topic/getTopicsByUserIdWithPage',
            params :{
                pages    :$scope.paginationConf.currentPage,
                pageSize :$scope.paginationConf.itemsPerPage,
                condition:$scope.condition,
                userId   :userId
            },
            method:'GET'
        }).success(function(data){
                console.log("分页后:"+data.topics);
                $scope.myTopics = data.topics; //根据后台对json的封装

                $scope.paginationConf.totalItems = data.recordsAll;
            }).error(function(data){
                //处理响应失败
                console.log("Toppic响应失败！");
            });
    }
    accessData();

    /**监听数据变化*/
    var watchData = function() {
        if ( userId != friendId ) {
            userId = friendId;
        }
        $scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage',function(newValue,oldValue){
            $http({
                url    :'/ecp/topic/getTopicsByUserIdWithPage',
                params :{
                    pages    :$scope.paginationConf.currentPage,
                    pageSize :$scope.paginationConf.itemsPerPage,
                    condition:$scope.condition,
                    userId   :userId
                },
                method :'GET'
            }).success(function(data){
                    $scope.myTopics = data.topics; //根据后台对json的封装
                    //$scope.sumPage = Math.ceil(data.recordsAll/$scope.pageSize);
                    $scope.paginationConf.totalItems = data.recordsAll;
                }).error(function(data){
                    //处理响应失败
                    console.log("Toppic响应失败！");
                });

        });
    }
    watchData();
});

/*用户关注控制器*/
app.controller('attentionController',function($scope,$http){
    $scope.attentions = [];
    //根据用户id获取用户发的帖子
    var userId = $('#userId').val();
    var friendId = $('#friendId').val();
    /*我的粉丝，不要删掉这里，之后会用到这里！！！！*/
    /* var friendId = $('#friendId').val();
     if ( userId != friendId ) {
     userId = friendId;
     }
     $http({
     url:'/rest/userController/getFllowers/'+userId,
     method:'GET'
     }).success(function(data){
     $scope.attentions = data;
     console.log('[attentions:]'+data);
     }).error(function(data){
     console.log('[attentionController->http请求失败]');
     });*/

    /*查询同室组的人，并且只显示5个*/
    $scope.departmentPersons = [];
    var getDepartmentPerson = function(userIdp,friendIdp) {
        var userId = userIdp;
        var friendId = friendIdp;
        if ( userId != friendId ) {
            userId = friendId;
        }
        $http({
            url:'/rest/userController/getDepartmentPersons/'+userId,
            method:'GET'
        }).success(function(data){
                $scope.departmentPersons = data;
                console.log('[attentions:]'+data);
            }).error(function(data){
                console.log('[attentionController->http请求失败]');
            });
    }
    getDepartmentPerson(userId,friendId);


});
