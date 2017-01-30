angular.module('pasteit.services', [])

.factory('socket', function(){
    //Creating connection with server
    var socket = io.connect('http://tranquil-atoll-83322.herokuapp.com');

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
    var hasUser = null;
    var user = {};
    var error = null;
    var registrationStatus = null;

    // return available functions for use in the controllers
    return {
      getUser: function(){
        return user;
      },
      getError: function(){
        return error;
      },
      isLoggedIn: function() {
                    return hasUser;
                  },
                  // todo refactor
      getUserStatus: function() {
        return hasUser;
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
              user = data;
              hasUser = true;
              deferred.resolve();
            } else {
              hasUser = false;
              deferred.reject();
            }
          })
          // handle error
          .error(function (data, status) {
            hasUser = false;
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
            hasUser = false;
            deferred.resolve();
          })
          // handle error
          .error(function (data) {
            hasUser = false;
            deferred.reject();
          });

        // return promise object
        return deferred.promise;

      },
      register: function(name, email, password) {
        // create a new instance of deferred
        var deferred = $q.defer();

        // send a post request to the server
        $http.post('/user/register',
          {name: name, email: email, password: password})
          // handle success
          .success(function (data, status) {
            if(status === 200){
              registrationStatus = data;
              deferred.resolve(registrationStatus);
            } else {
              // deferred.reject("sambei");
            }
          })
          // handle error
          .error(function (data) {
            deferred.reject(data);
          });

        // return promise object
          return deferred.promise;

      }
    };

}]);
