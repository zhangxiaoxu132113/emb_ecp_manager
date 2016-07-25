/**
 * Created by zml on 16-4-5.
 */
var app = angular.module("ecpManager",['ui.router','tm.pagination']);

app.config(["$stateProvider", "$urlRouterProvider", "$httpProvider", function($stateProvider, $urlRouterProvider, $httpProvider) {

    $urlRouterProvider.otherwise("/checkedPost");

    $stateProvider
        .state('checkedPost', {
            url: "/checkedPost",
            templateUrl: "skin/white/template/shenhe.html"
        })
        .state('rewardPoint', {
            url: "/rewardPoint",
            templateUrl: "skin/white/template/rewardPoint.html"
        })


}]);
app.controller("managerCtrl",function($scope) {

})
app.controller("checkedPostController",function($scope,$http){
    $scope.topics = [];
    $scope.pages = 1;
    $scope.pageSize = 10;


    //一定要写在$http的请求之前，因为$http请求中有用到这里的参数！
    $scope.paginationConf = {
        currentPage: 1, //默认当前页为第一页
        itemsPerPage: 10//表示每页显示多少条数据
    };
    //请求后台需要审核的帖子
    $http({
        url:'/ecp/manager/checkedPost',
        params :{
            pages : $scope.paginationConf.currentPage,
            pageSize : $scope.paginationConf.itemsPerPage
        },
        method:'GET'
    })
        .success(function(data){
            $scope.topics = data.topics; //根据后台对json的封装
            $scope.paginationConf.totalItems = data.recordsAll;
        })
        .error(function(data){
            //处理响应失败
            alert("Topic响应失败！");
        });


    /***************************************************************
     当页码和页面记录数发生变化时监控后台查询
     如果把currentPage和itemsPerPage分开监控的话则会触发两次后台事件。
     ***************************************************************/
    $scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage',function(newValue,oldValue){
        //alert("新的值："+newValue+"之前的值："+oldValue);
        $http({
            url:'/ecp/manager/checkedPost',
            params :{
                pages : $scope.paginationConf.currentPage,
                pageSize : $scope.paginationConf.itemsPerPage
            },
            method:'GET'
        }).success(function(data){
                $scope.topics = data.topics; //根据后台对json的封装
                $scope.paginationConf.totalItems = data.recordsAll;
            }).error(function(data){
                //处理响应失败
                alert("Topic响应失败！");
            });

    });

    var findId = function(id){
        var index = -1;
        angular.forEach($scope.topics,function(item,key){//key表示数组的下标，查看forEach方法，并打印key值即可知道
            if(item.ID === id){
                index = key;   //索引值
                return; //表示返回true,不能用break    注意这里！！
            }
        });
        return index;
    }
    $scope.remove = function(id){
        var index = findId(id);

        if(index !== -1){
            $scope.topics.splice(index,1);
        }


    }

    //审核帖子能否发布！
    $scope.checked = function(id,flag){//传入的是帖子的ID
        if(!flag){
            //审核不通过
            var returnValue = confirm("确定审核不通过吗？");
            if(!returnValue){
                return ;
            }
            else{
                $scope.updateChecked(id,flag);
            }
        }else{
            $scope.updateChecked(id,flag);
        }

    }


    $scope.updateChecked = function(id,flag){
        $http({
            url:'/ecp/manager/agreePublic',
            params :{
                id : id,
                agree : flag
            },
            method:'POST'
        }).success(function(data){
                $scope.remove(id);
                $http({
                    url:'/ecp/manager/checkedPost',
                    params :{
                        pages : $scope.paginationConf.currentPage,
                        pageSize : $scope.paginationConf.itemsPerPage
                    },
                    method:'GET'
                })
                    .success(function(data){
                        $scope.topics = data.topics; //根据后台对json的封装
                        $scope.paginationConf.totalItems = data.recordsAll;
                    })
                    .error(function(data){
                        //处理响应失败
                        alert("Topic响应失败！");
                    });

            }).error(function(data){
                //处理响应失败
                alert("响应失败！");
            });
    }

});

//审核积分的Controller
app.controller("rewardPointController",function($scope,$http){
    console.log("in the rewardPointController");
    $scope.topics = [];
    $scope.pages = 1;
    $scope.pageSize = 10;
    $scope.pTest="test1";


    //一定要写在$http的请求之前，因为$http请求中有用到这里的参数！
    $scope.paginationConf = {
        currentPage: 1, //默认当前页为第一页
        itemsPerPage: 10//表示每页显示多少条数据
    };
    //请求后台需要审核的帖子
    $http({
        url:'/ecp/manager/rewardPoint',
        params :{
            pages : $scope.paginationConf.currentPage,
            pageSize : $scope.paginationConf.itemsPerPage
        },
        method:'GET'
    })
        .success(function(data){
            $scope.topics = data.topics; //根据后台对json的封装
            $scope.paginationConf.totalItems = data.recordsAll;
        })
        .error(function(data){
            //处理响应失败
            alert("没有可审核的帖子！");
        });


    /***************************************************************
     当页码和页面记录数发生变化时监控后台查询
     如果把currentPage和itemsPerPage分开监控的话则会触发两次后台事件。
     ***************************************************************/
    $scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage',function(newValue,oldValue){
        //alert("新的值："+newValue+"之前的值："+oldValue);
        $http({
            url:'/ecp/manager/rewardPoint',
            params :{
                pages : $scope.paginationConf.currentPage,
                pageSize : $scope.paginationConf.itemsPerPage
            },
            method:'GET'
        }).success(function(data){
                $scope.topics = data.topics; //根据后台对json的封装
                $scope.paginationConf.totalItems = data.recordsAll;
            }).error(function(data){
                //处理响应失败
                alert("Topic响应失败！");
            });

    });


    //封装一个方法，用于验证ID在topics中是否存在
    var findId = function(id){
        var index = -1;
        angular.forEach($scope.topics,function(item,key){//key表示数组的下标，查看forEach方法，并打印key值即可知道
            if(item.topicId == id){
                index = key;   //索引值
                return; //表示返回true,不能用break    注意这里！！
            }
        });
        return index;
    }
    $scope.remove = function(id){

        var index = findId(id);

        if(index !== -1){
            $scope.topics.splice(index,1);
        }


    }
    //管理员给积分
    $scope.score = function(id,flag){//传入的是帖子的ID
        //把帖子id的值传入到弹出的DIV框中
        $("#topicId").val(id);
        $("#flag").val(flag);
        if(!flag){
            var returnValue = confirm("确定不给积分吗？");
            if(!returnValue){
               return ;
            }else{
                $scope.updatePoint(id,flag,0,0);
            }
        }

    }
    $scope.addPoint = function(){
        //获取所加积分帖子的帖子ID
        var topicId= $("#topicId").val();
       /* var flag = $("#flag").val();*/


        //给积分的情况
        //获取参与者积分单选框元素
        var pointParObj = $("input[name='pointParticipants']");
        var participantsPoint = 0;
        for(var i=0;i<pointParObj.length;i++){
            if(pointParObj[i].checked){
                participantsPoint = pointParObj[i].value;
            }
        }
        //获取创建者积分单选框元素
        var pointCreatorObj = $("input[name='pointCreator']");
        var creatorPoint = 0;
        for(var i=0;i<pointCreatorObj.length;i++){
            if(pointCreatorObj[i].checked){
                creatorPoint = pointCreatorObj[i].value;
            }
        }
        if(participantsPoint==0||creatorPoint==0){
            $("#mess").css("display","block");
        }else{
            $("#mess").css("display","none");
        }
        $scope.updatePoint(topicId,true,participantsPoint,creatorPoint);



    }

    $scope.updatePoint = function(id,flag,participantsPoint,creatorPoint){
        $http({
            url:'/ecp/manager/agreeActivityAddMount',
            params :{
                topicId : id,
                participantsPoint : participantsPoint,
                creatorPoint : creatorPoint,
                flag : flag
            },
            method:'POST'
        }).success(function(data){
                //加分成功
                $("#myModal").css("display","none");
                $scope.remove(id);
                $http({
                    url:'/ecp/manager/rewardPoint',
                    params :{
                        pages : $scope.paginationConf.currentPage,
                        pageSize : $scope.paginationConf.itemsPerPage
                    },
                    method:'GET'
                }).success(function(data){
                    $scope.topics = data.topics; //根据后台对json的封装
                    $scope.paginationConf.totalItems = data.recordsAll;
                })
                .error(function(data){
                    //处理响应失败
                    alert("没有可积分的帖子！");
                });

            })
            .error(function(data){
                //积分失败
                alert("积分失败");
            });
    }
});




