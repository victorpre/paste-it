angular.module('pasteit.controllers', [])

.controller('MainCtlr', ['$scope', '$http', '$location', 'socket', function($scope, $http, $location, socket){
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
  $scope.note_title = $routeParams.noteTitle;
  var path = '/api/v1/paste-it/'+$scope.note_title;
  $scope.noteData = {};
  $http.get(path).then(function successCallback(response) {
    $scope.noteData = response.data[0];
    $('#textarea1').val($scope.noteData.text);
    $('#textarea1').trigger('autoresize');
    $('#textarea1').trigger('focus');
  }, function errorCallback(response) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
  });

}]);
