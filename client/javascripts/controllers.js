angular.module('pasteit.controllers', [])

.controller('MainCtlr', ['$scope', '$http', '$location', 'socket', function($scope, $http, $location, socket){
  $scope.notOnHomeScreen = false;

  // Login
  $(document).ready(function(){
    $('.modal').modal({
      starting_top: '50%', // Starting top style attribute
      ending_top: '10%', // Ending top style attribute
    });
  });

  $scope.submitLogin = function(){
    // Implement auth logic
  };

  // Copy URL
  var clipboard = new Clipboard('.share-btn');
  $scope.copy = function(){
    Materialize.toast('Copied!', 2000)
  }

  if($location.path()!="/"){
    $scope.notOnHomeScreen=true;
  }

  // Download note
  $scope.download = function(){
    var fileName = $location.path().substr(1);
    download($('#textarea1').val(), fileName+".txt", "text/plain");
  }

  $scope.shareUrl = $location.absUrl();

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

    $scope.goToPage = function(){
      console.log($scope.pageName);
      var path = "/";
      if(typeof $scope.pageName!="undefined"){
        $scope.notOnHomeScreen = true;
        path = path+$scope.pageName;
      }
      $location.path(path);
      $('.icon-close').click();
      $scope.pageName = "";
    }
}])

.controller('OtherCtlr', ['$scope', '$http', '$routeParams','$timeout','socket', function($scope, $http, $routeParams,$timeout, socket){
  $scope.saving =  false;
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
         clearTimeout(timer);
         timer = setTimeout(saveOnDB, 3500)
  });

  function saveOnDB() {
      $http.put(path, {text: $scope.noteText})
      .success((data) => {
        $scope.saving = false;
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


    $scope.noteText = data;
    $scope.saving = true;
    var async_timer = $timeout(stopTimer,3500)
    $('#textarea1').trigger('autoresize');
    $('#textarea1').trigger('focus');
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

            $scope.$watch('noteText', function(data) {

                if(typeof data != 'undefined'){
                  // Resize if is empty
                  if(data.length==0){
                    element.trigger('autoresize');
                  }
                }
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
