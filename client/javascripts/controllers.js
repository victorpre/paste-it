angular.module('pasteit.controllers', [])

.controller('MainCtlr', ['$scope', '$http','socket', function($scope, $http, socket){
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
