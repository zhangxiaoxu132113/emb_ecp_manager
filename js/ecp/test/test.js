/**
 * Created by mrwater on 16/3/23.
 */
angular.module('application',[])
    .controller("loginController",function($scope,$rootScope,AUTH_EVENTS,AuthService){
        $scope.credentials = {
            username : '',
            password : ''
        };
        $scope.login = function (credentials){
            console.log('in loginController login');
            console.log('username = '+credentials.username+' and password = '+credentials.password);
//                    AuthService.login(credentials).then(function (user){
//                        $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
//                        $scope.setCurrentUser(user);
//
//                    },function(){
//                        $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
//                    });
            AuthService.login(credentials);
        };javascript:void(0);
    })
    .constant('AUTH_EVENTS',{
        loginSuccess:'auth-login-success',
        loginFailed:'auth-login-failed',
        logoutSuccess:'auth-logout-success',
        sessionTimeout:'auth-session-timeout',
        notAuthenticated:'auth-not-authenticated',
        notAuthorized:'auth-not-authorized'
    })
    .constant('USER_ROLES',{
        all:'*',
        admin:'admin',
        editor:'editor',
        guest:'guest'
    })
    .factory('AuthService',function($http,Session){
        var authService = {};
        authService.login = function(credentials){
            console.log('username = '+credentials.username+' and password = '+credentials.password);
            return $http
                .post('/rest/userController/auth',credentials)
                .then(function(res){
                    console.log(res.data);
                    Session.create(res.data.ID, res.data.UserName, res.data.NickName);
                    return res.data;
                });
        };
        authService.isAuthenticated = function() {
            return !!Session.userId;
        };
        authService.isAuthorized = function(authorizedRoles) {
            if(angular.isArray(authorizedRoles)){
                authorizedRoles = [authorizedRoles];
            }
            return (authService.isAuthenticated() && authorizedRoles.indexOf(Session.userRole) !== -1);
        };
        return authService;
    })
    .service('Session', function () {
        this.create = function(ID,UserName,NickName){
            console.log(ID+'/'+UserName+'/'+NickName);
            this.ID = ID;
            this.UserName = UserName;
            this.NickName = NickName;
        };
        this.destroy = function () {
            this.ID = null;
            this.UserName = null;
            this.NickName = null;
        };
        return this;
    });




