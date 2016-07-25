/**
 * Created by mrwater on 16/3/23.
 */
//var app = angular.module('service.user',[]);
//app.service('userService', function ($http) {
//    this.user = {};
//    console.log("in the userService");
//    if(user == null) {
//        $http({
//            url:'/rest/userController/getUser/1',
//            method:'GET'
//        })
//        .success(function(data){
//            this.user = data;
//            console.log("this.user:"+this.user);
//        })
//        .error(function(data){
//            alert("[userService]œÏ”¶ ß∞‹");
//        });
//    } else {
//
//    }
//    return this;
//});

var app = angular.module('userServiceApp',[]);

app.service('userService',function($http){
    //this.user = {NickName:"xiaomimi"};
    if (this.user == null) {
        //console.log("function : userService");
        //this.username = 'zhangmaiojie';
        //this.password = '123456';
        $http({
            url:'/rest/userController/getUser/1',
            method:'GET'
        })
            .success(function(data){
                console.log("this.user:"+data.NickName);
                this.user = data;

            })
            .error(function(data){
                alert("[userService]œÏ”¶ ß∞‹");
            });
    }


    return this;
});