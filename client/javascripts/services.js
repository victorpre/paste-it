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
    var error = null;

    // return available functions for use in the controllers
    return {
      getError: function(){
        return error;
      },
      isLoggedIn: function() {
                    if(user) {
                      return true;
                    } else {
                      return false;
                    }
                  },
      getUserStatus: function() {
        return user;
      },
      login: function(email, password) {

        // create a new instance of deferred
        var deferred = $q.defer();
        console.log(email,password);
        // send a post request to the server
        $http.post('/user/login',
          {email: email, password: password})
          // handle success
          .success(function (data, status) {
            if(status === 200){
              console.log(data, status);
              user = true;
              deferred.resolve();
            } else {
              user = false;
              deferred.reject();
            }
          })
          // handle error
          .error(function (data, status) {
            user = false;
            deferred.reject();
          });

        // return promise object
        return deferred.promise;

      },
      logout: function() {
        // create a new instance of deferred
        var deferred = $q.defer();

        // send a get request to the server
        $http.get('/user/logout')
          // handle success
          .success(function (data) {
            user = false;
            deferred.resolve();
          })
          // handle error
          .error(function (data) {
            user = false;
            deferred.reject();
          });

        // return promise object
        return deferred.promise;

      },
      register: function(email, password) {
        // create a new instance of deferred
        var deferred = $q.defer();

        // send a post request to the server
        $http.post('/user/register',
          {email: email, password: password})
          // handle success
          .success(function (data, status) {
            console.log(data);
            if(status === 200 && data.status){
              deferred.resolve();
            } else {
              deferred.reject();
            }
          })
          // handle error
          .error(function (data) {
            deferred.reject();
          });

        // return promise object
        return deferred.promise;

      }
    };

}]);
