angular.module('pasteit.controllers', [])

.controller('MainCtlr', ['$scope', '$http','socket', function($scope, $http, socket){

  $('.control').click( function(){
    $('.icon-close').removeClass('disabled');
    $('body').addClass('mode-search');
      $('.input-search').focus();
    });

    $('.icon-close').click( function(){
      $('.icon-close').addClass('disabled');
      $('body').removeClass('mode-search');
    });


  $scope.formData = {};
  $scope.noteData = {};
  // Get all notes
  $http.get('/api/v1/paste-it')
  .success((data) => {
    $scope.noteData = data;
    console.log(data);
  })
  .error((error) => {
    console.log('Error: ' + error);
  });
}])

.controller('OtherCtlr', ['$scope', '$http','$routeParams','socket', function($scope, $http,$routeParams, socket){
  console.log("pindiporco");
  $scope.node_title = $routeParams.noteTitle;
  console.log($scope.node_title);
  var path = '/api/v1/paste-it/'+$scope.node_title;
  console.log(path);
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
