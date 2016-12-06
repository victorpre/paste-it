angular.module('pasteit.controllers', [])

.controller('MainCtlr', ['$scope', '$http', '$location', 'socket', function($scope, $http, $location, socket){
  // Copy URL
  var clipboard = new Clipboard('.share-btn');
  $scope.copy = function(){
    Materialize.toast('Copied!', 2500)
  }
  // Download note
  $scope.download = function(){
    var fileName = $location.path().substr(1);
    download($('#textarea1').val(), fileName+".txt", "text/plain");
  }
  $scope.shareUrl = "sambei na cara do perigo";

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

    $scope.goToPage = function(){
      console.log($scope.pageName);
      var path = "/"+$scope.pageName;
      $location.path(path);
      $('.icon-close').click();
      $scope.pageName = "";
    }

    $scope.formData = {};
    $scope.noteData = {};
    // Get all notes
    $http.get('/api/v1/paste-it')
    .success((data) => {
      $scope.noteData = data;
      // console.log(data);
    })
    .error((error) => {
      console.log('Error: ' + error);
    });
}])

.controller('OtherCtlr', ['$scope', '$http', '$routeParams','socket', function($scope, $http, $routeParams, socket){
  $scope.saving =  false;
  $scope.noteTitle = $routeParams.noteTitle;
  var path = '/api/v1/paste-it/'+$scope.noteTitle;
  $scope.noteData = {};
  $http.get(path).then(function successCallback(response) {
    $scope.noteData = response.data[0];
    $scope.noteText = $scope.noteData.text;
    $scope.noteTitle = $scope.noteData.title;
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
      console.info('do stuff');
      $http.put(path, {text: $scope.noteText})
      .success((data) => {
        $scope.saving = false;
        $scope.noteData = data;
        console.log(data);
      })
      .error((error) => {
        console.log('Error: ' + error);
      });
  }

  // Sockets
  console.log($scope.noteTitle);
  socket.listen($scope.noteTitle,function(data){
    function stopTimer(){
      $scope.saving = false;
    }
    var async_timer = setTimeout(stopTimer,3000)
    $scope.noteText = data;
    $scope.saving = true;
    $('#textarea1').trigger('autoresize');
    $('#textarea1').trigger('focus');
  });

  $scope.updateText = function(){
    $scope.saving = true;
    socket.send($scope.noteTitle, $scope.noteText);
  }

}]);
