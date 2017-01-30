angular.module('pasteit.controllers', [])

.controller('MainCtlr', ['$scope', '$http', '$location','AuthService', 'socket', function($scope, $http, $location, AuthService, socket){
  $scope.notOnHomeScreen = false;
  $scope.shareUrl = $location.absUrl();
  $scope.userLoggedIn = false;
  $scope.user = {};

  $(document).ready(function(){
    $('.modal').modal({
      starting_top: '50%', // Starting top style attribute
      ending_top: '10%', // Ending top style attribute
    });
  });

  // Copy URL
  var clipboard = new Clipboard('.share-btn');
  $scope.copy = function(){
    Materialize.toast('Copied!', 2000)
  }


  // To DO refactor
  if($location.path()!="/"){
    $scope.notOnHomeScreen=true;
  }

  // Login
  $scope.submitLogin = function(){
    $scope.loginError = false;
    $scope.loginDisabled = true;
    AuthService.login($scope.loginForm.email,$scope.loginForm.password)
    .then(function () {
          $scope.userLoggedIn = AuthService.getUserStatus();
          $scope.user = AuthService.getUser();
          $scope.errorMessage = "";
          $location.path('/');
          $('#login-modal').modal('close');
          $scope.disabled = false;
          $scope.loginForm = {};
        })
        // handle error
        .catch(function () {
          $scope.loginError = true;
          $scope.errorMessage = "Invalid email and/or password";
          $scope.loginForm = {};
        });

  };

  // Register
  $scope.submitRegistration = function(){
    $scope.registrationError = false;
    // $scope.loginDisabled = true;
    AuthService.register($scope.registrationForm.name, $scope.registrationForm.email, $scope.registrationForm.password)
    .then(function (status) {
          $scope.registrationMessage = status;
          Materialize.toast($scope.registrationMessage, 4500)
          $scope.registrationForm = {};
          $('#login-modal').modal('close');
        })
        // handle error
        .catch(function (reason) {
          console.log(reason);
          $scope.registrationError = reason;
          $scope.registrationForm = {};
        });

  };

  // Download note
  $scope.download = function(){
    var fileName = $location.path().substr(1);
    download($('#textarea1').val(), fileName+".txt", "text/plain");
  }
  // Go to note
  $scope.goToPage = function(){
    console.log($scope.pageName);
    var path = "/";
    if(typeof $scope.pageName!="undefined"){
      $scope.notOnHomeScreen = true;
      path = path+$scope.pageName;
    }
    $location.path(path);
    $scope.notOnHomeScreen = false;
    $('.icon-close').click();
    $scope.pageName = "";
  }

  // UI
  $('.control').click( function(){
    $('.icon-close').removeClass('disabled');
    $('.icon-search').addClass('transparent');
    $('body').addClass('mode-search');
      $('.input-search').focus();
    });

    $('.icon-close').click( function(){
      $('.icon-close').addClass('disabled');
      $('body').removeClass('mode-search');
      $('.icon-search').removeClass('transparent');
    });

    $scope.loginModal = function(){
      $('#login-modal').modal('open');
      $('ul.tabs').tabs('select_tab', 'tab-signin');
    };
}])

.controller('OtherCtlr', ['$scope', '$http', '$routeParams','$timeout','socket', function($scope, $http, $routeParams,$timeout, socket){
  $scope.saving =  false;
  $scope.readyToListen = true;
  $scope.noteTitle = $routeParams.noteTitle;
  var path = '/api/v1/paste-it/'+$scope.noteTitle;
  $scope.noteData = {};
  $http.get(path).then(function successCallback(response) {
    $scope.noteData = response.data[0];
    $scope.noteText = $scope.noteData.text;
    $scope.noteTitle = $scope.noteData.title;
    $('#textarea1').val($scope.noteText);
    $('#textarea1').trigger('autoresize');
    $('#textarea1').trigger('focus');
  }, function errorCallback(response) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
  });

  // Time out to persist in DB
  var timer = null;
  $('#textarea1').keydown(function(){
         $scope.readyToListen = false;
         clearTimeout(timer);
         timer = setTimeout(saveOnDB, 3500)
  });

  function saveOnDB() {
      $http.put(path, {text: $scope.noteText})
      .success((data) => {
        $scope.saving = false;
        $scope.readyToListen = true;
        // $scope.noteData = data;
      })
      .error((error) => {
        console.log('Error: ' + error);
      });
  }

  function stopTimer(){
    $scope.saving = false;
  }
  // Sockets
  socket.listen($scope.noteTitle,function(data){
    if ($scope.readyToListen){
      $scope.noteText = data;
      $scope.saving = true;
      var async_timer = $timeout(stopTimer,3500)
      $('#textarea1').trigger('autoresize');
      $('#textarea1').trigger('focus');
    }
  });

  $scope.updateText = function(){
    $scope.saving = true;
    socket.send($scope.noteTitle, $scope.noteText);
  }

}])

.directive('textBox', ['$timeout', function($timeout) {
   return {
        link: function($scope, element, attrs){
            $timeout(function() {
              element.trigger('autoresize');
            });
        }
    };
}])

.controller('HomeCtlr', ['$scope', '$http', '$routeParams','$timeout','socket', function($scope, $http, $routeParams,$timeout, socket){
  // Parallax
  $(document).ready(function(){
      $('.parallax').parallax();
  });
}]);
