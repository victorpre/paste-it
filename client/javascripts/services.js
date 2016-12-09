angular.module('pasteit.services', [])

.factory('socket', function(){
    //Creating connection with server
    var socket = io.connect('http://localhost:3000');

    return{
      listen: function(eventName, callback){
        socket.on(eventName, callback);
      },
      send: function(title, text){
        socket.emit("public",{title: title, text: text});
      }
    };

  return socket;

})

.factory('AuthService',['$q', '$timeout', '$http', function ($q, $timeout, $http) {
    // create user variable
    var user = null;

    // return available functions for use in the controllers
    return ({
      isLoggedIn: isLoggedIn,
      getUserStatus: getUserStatus,
      login: login,
      logout: logout,
      register: register
    });

}]);
