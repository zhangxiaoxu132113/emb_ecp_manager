/**
 * Created by mrwater on 16/3/24.
 */
var app = angular.module('postApp',[]);

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

app.controller('postCtrl',function($scope,$http){
    $scope.topic = {};
    var isParticipate = false;
    var participateRowId = -1;

    $http({
        url:'/ecp/topic/getTopicById/'+$('#topicId').val(),
        method:'GET'
    })
    .success(function (data){
        console.log(data);
        $scope.topic = data;
        if ($scope.topic.isParticipant != 0) {
            console.log("isParticipant",isParticipate);
            isParticipate = true;
            participateRowId = 1;
            $('#participateBtn').html('取消参与');
        }

        /*修改时间格式*/
        $scope.topic.CreatedOn  = format($scope.topic.CreatedOn,'yyyy-MM-dd HH:mm:ss');
        angular.forEach($scope.topic.replies, function(data,index,array){
            data.CreatedOn = format(data.CreatedOn,'yyyy-MM-dd HH:mm:ss');
        });
    })
    .error(function (data){
        console.log("postCtrl 获取数据失败!");
    });

    /**显示登陆按钮*/
    $scope.showLoginFrame = function() {
        $('#loginFrameID').slideToggle('slow');
    }

    /**显示参与者详情的窗口*/
    $scope.showParticiateFrame = function() {

        $http({
            url:'/ecp/topic/getParticipate',
            params:{topicId:$scope.topic.ID},
            method:'POST'
        })
            .success(function(data) {
                topic.participants = data;
                $('#particateDetailFull').css('display','block');
                $('.particateDetail').addClass('animated zoomInDown');
            })
            .error(function(data) {
                alert("showParticiateFrame响应失败!");
            });

    }
    $scope.$watch('topic',function(newValue,oldValue, scope){

        console.log(newValue);

        console.log(oldValue);

    });

    /**关闭参与详情的窗口*/
    $scope.closeParticateDetailFrame = function (){
        $('#particateDetailFull').css('display','none');

    }
    /**提交评论数*/
    $scope.submitCommand = function() {
        var userHeadImage = $('#user-headImage').val();
        var userNickName = $('#user-nickName').val();
        var reply = {};
        reply.topicId = $scope.topic.ID;
        reply.body = $('#replyContent').val();
        reply.userId = $('#userId').val();
        reply.modifiedOn = new Date();
        reply.createdOn = new Date();
        $http({
            url:'/ecp/topic/addReply',
            method:'POST',
            data:reply,
            headers: {'Content-type': 'application/json;charset=UTF-8'}
        })
            .success(function(data) {
                if (data == "authFailure") {
                    alert("请先登录,再操作!");
                    return;
                }
                //隐藏该div内容
                $('#isHiddenWithReplies').css('display','none');

                $('#ecp-reply').append(
                "<div class='row'>"+
                    "<div class='col-md-1 ecp-postDetail-command-user' style='padding-left: 0;padding-right: 0;'>"+
                "<p style='text-align: center;'>"+
                "<a href='#'><img src='"+userHeadImage+"' width='48' height='48' class='img-circle'></a><br>"+
                "</p>"+
                "</div>"+
                "<div class='col-md-11 ecp-postDetail-command-content' style='padding-bottom: 10px' >"+
                "<div style='background-color:rgb(239,239,239);padding: 5px 10px;border-radius:3px'>"+
                "<span style='padding-top: 5px'>"+userNickName+"</span><br/>"+
                "<span class='ecp-postDetail-command-date'>评论于 : "+format(reply.createdOn.getTime(), 'yyyy-MM-dd HH:mm:ss')+"</span>"+
                "<div style='margin-bottom: 0'>"+
                    reply.body+
                "</div>"+
                "<a class='replyBtn'>回复</a>"+
                "<p style='clear: both;margin: 0;'></p>"+
                "</div>"+
                "</div>"+
                "</div>"
                );
                //清空回复框的内容
                $('#replyContent').text(" ");
            })
            .error(function(data) {

            });

    }

    /**参与活动按钮事件*/
    $scope.participateActivity = function() {
        if (!isParticipate) {
            $('#participateBtn').html('取消参与');
            $http({
                url:'/ecp/topic/participate',
                method:'POST',
                params:{topicId:$scope.topic.ID,userId:$('#userId').val()}
            }).success(function(data) {
                //participateRowId = data.participateRowId;
                //在显示该活动贴参与用户头像追加当前参与活动的用户
                //if (participateRowId == -1) {
                //    alert("你已经参与过该活动了.")
                //    return;
                //}
                participateRowId = 1;
                $("#participate-userList").append(
                    "<img src='"+$('#user-headImage').val()+"' id='user-headImage"+$('#userId').val()+"' class='img img-circle bounceIn animated' width='34 height='34'/>"
                );

                $('#user-headImage'+$('#userId').val()).addClass('bounceIn animated');
            }).error(function(data) {
                alert("tianjia shibai");
            });
        } else {
            $('#participateBtn').html('参加活动');
            if (participateRowId != -1) {
                $http({
                    url:'/ecp/topic/cancelParticipate',
                    method:'POST',
                    params:{topicId:$scope.topic.ID,userId:$('#userId').val()}
                }).success(function(data) {
                    //participateRowId = -1;

                    $('#user-headImage'+$('#userId').val()).addClass('bounceOut animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
                        $('#user-headImage'+ $('#userId').val()).remove();
                    });
                }).error(function(data) {
                    alert("tianjia shibai ");
                });
            }
        }
        isParticipate = !isParticipate;
    }

    /**获取精华帖子*/
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
});