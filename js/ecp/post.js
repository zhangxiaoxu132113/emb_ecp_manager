

var app = angular.module('postApp',[]);



/*发帖页面控制器*/
app.controller('addPostController',function($scope,$http,$location,$window){
    //创建时间
    $scope.createTime = new Date;
    setInterval(function(){
        $scope.$apply(function(){
            $scope.createTime = new Date();
        });
    },1000);


    $scope.topic = {};
    $scope.selectedAllInfo = [];
    $scope.typeList = [];
    $scope.modulesSelected = [];
    $scope.sponsorSelected = [];

    $scope.roleSelectedObj;
    $scope.moduleSelectedObj;

    $scope.topic.createdOn =  $scope.createTime;
    $scope.topic.createUserID = $('#userId').val();

    /*不同模块链接到发帖页面,默认关联选择模块    */
    var moduleParameter = $("#moduleParameter").val();
    var moduleSelectedParameter = "#"+moduleParameter;


    //请求三个下拉框数据
    $http({
        url:'/ecp/topic/getSelectedAllInfo/'+$('#userId').val(),
        method:'GET'
    }).success(function(data){
        $scope.selectedAllInfo = data;
        //这个是在后台封装好的，一定要对应后台的变量
        $scope.typeList = data.typeList;
        //设置默认选中,记得写在循环的前面,不然从个人页面跳过来的发帖页面不会自动选中个人！！！！
        $scope.roleSelectedObj = $scope.typeList[0];
        $scope.topic.type_ID = $scope.roleSelectedObj.typeID;
        $scope.modulesSelected = data.modulesList;
        $scope.sponsorSelected = data.allUserList;

        angular.forEach($scope.modulesSelected,function(item,key){
            if(item.Key == moduleSelectedParameter){
                $scope.moduleSelectedObj = item;
                $scope.topic.moduleID = item.ID;

            }

        });


        console.log("moduleSelectedObj : "+$scope.moduleSelectedObj.Key);
        if ($scope.moduleSelectedObj.Key == "#activity") {
            $('.ecp-topic-selectWhenActivity').css('display','block').slideDown('slow');
        }



        console.log($scope.moduleSelectedObj);
        }).error(function(data){
        //处理响应失败
        alert("下拉框信息获取失败！");
    });

    /**监听角色下拉框的事件*/
    $scope.roleSelectedChange = function(roleSelectedObj){
        console.log(roleSelectedObj);
        $scope.topic.type_ID = $scope.roleSelectedObj.typeID;
    }

    /**监听模块下拉框的事件*/
    $scope.moduleSelectedChange = function(moduleSelectedObj){
        console.log(moduleSelectedObj);


        /**如果是活动模块,则显示选择日期和活动参与者的人*/
        angular.forEach($scope.modulesSelected,function(data,index,array){
            //if(data.Name==moduleSelectedObj){
            //    $scope.topic.moduleID = item.ID;
            //}
            if (data.ID == moduleSelectedObj.ID) {

                if (data.Key == "#activity") {
                   $('.ecp-topic-selectWhenActivity').css('display','block').slideDown('slow');
                }else {
                    $('.ecp-topic-selectWhenActivity').css('display','none');
                }

            }
        });
      /*  angular.forEach($scope.modulesSelected,function(item,key){

        });*/

    }

    /**监听参与者下拉框的事件*/
    $scope.sponsorSelectedChange = function(sponsorSelectedObj){
        console.log(sponsorSelectedObj);
        $scope.topic.sponsorID = sponsorSelectedObj;
    }

    /**显示退出编辑提示框*/
    $scope.showExitTooltip = function() {
        $('.exit-tooltip').fadeToggle("fast");
    }

    /**隐藏退出编辑提示框*/
    $scope.hideExitTooltip = function() {
        $('.exit-tooltip').fadeToggle("fast");
    }

    /**退出编辑,返回上一页面*/
    $scope.goBack = function() {
        history.go(-1);
    }

    /**再写一篇按钮操作*/
    $scope.writeAgain = function() {
        $('html, body').animate({scrollTop: 0}, 800);
        setTimeout(function(){
            location.reload();
        },1000);
    }

    /**表单提交*/
    $scope.submitForm = function(topic,flag){
        var isBreak = false;
        var beginTimeStr = $('#beginTime').val();
        var endTimeStr = $('#endTime').val();
        var beginTime = new Date(beginTimeStr.replace(/-/g, "/"));
        var endTime = new Date(endTimeStr.replace(/-/g,"/"));
        /**判断用户发的帖子是否是活动贴,如果是,则进行时间的判断*/
        angular.forEach($scope.modulesSelected,function(data,index,array){
            if (data.ID == topic.moduleID) {
                if (data.Name == "活动模块") {
                    console.log("beginTime="+beginTime);
                    /***/
                    if (beginTimeStr == '') {
                        alert('活动开始时间不能为空!');
                        isBreak = true;
                        return;
                    } else if (endTimeStr == '') {
                        alert('活动结束时间不能为空!');
                        isBreak = true;
                        return;
                    } else if (beginTime>endTime) {
                        alert('活动结束时间不能小于活动开始时间');
                        isBreak = true;
                        return;
                    }
                    topic.beginTime = beginTime;
                    topic.endTime = endTime;
                }
            }
        });
        if (isBreak) return;
        console.log(topic);
        if(!flag){//通过校验
            $('#ecp-fullbg').css('display','block');
            //console.log("CreateOn:"+topic.CreatedOn);
            //var myDate=new Date();
            //console.log("Date:"+myDate);
            //topic.CreatedOn  = myDate;
            //TODO 时间的设置交付后台来处理
            $http({
                url:'/ecp/topic/addPost',
                method:'POST',
                data:topic,
                headers: {'Content-type': 'application/json;charset=UTF-8'}
            })
            .success(function(data){//保存文章成功会返回该帖子的id字段
                //$window.location.href = "/postDeal";//可以链接到后台！
                setTimeout(function(){
                    $('#ecp-load-id').css('display','none'); //隐藏加载框
                    $('#ecp-success-tip-id').css('display','block'); //显示添加帖子成功的提示框
                    $('#ecp-success-tip-id').addClass('bounceIn animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
                        $('#checkDetailsId').attr('href','/post/'+data.topicId);
                    });
                },1000);
            }).error(function(data){
                //处理响应失败
                alert("帖子发布失败！");
                $('#ecp-fullbg').css('display','none');
            });
        } else {
            alert("标题、内容、模块为必填项！");

        }
    }

    /**重置按钮相应事件*/
    $scope.reset = function(){
        $scope.topic.title = "";
        $scope.topic.body = "";
    }


});

/**ckEditor,因为这里定义了，所以在页面就无需定义一个新的ckeditor了，注意看浏览器控制台，
*如果页面用ckeditor官方的方法定义一个ckeditor，就会出错，说重复定义一个ckeditor*/
app.directive('ckeditor', function() {
    return {
        require : '?ngModel',
        link : function(scope, element, attrs, ngModel) {
            var ckeditor = CKEDITOR.replace(element[0], {

            });
            if (!ngModel) {
                return;
            }
            ckeditor.on('instanceReady', function() {
                ckeditor.setData(ngModel.$viewValue);
            });
            ckeditor.on('pasteState', function() {
                scope.$apply(function() {
                    ngModel.$setViewValue(ckeditor.getData());
                });
            });
            ngModel.$render = function(value) {
                ckeditor.setData(ngModel.$viewValue);
            };
        }
    };
});