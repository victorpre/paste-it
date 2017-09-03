angular.module('typeonme').controller('NotesController', ['$scope', '$http', '$routeParams', NotesController])


function NotesController($scope, $http, $routeParams) {
  $scope.noteTitle = $routeParams.noteTitle;
  $scope.apiUrl = 'http://localhost:3003/api/v2/notes/';
  $scope.getNote = function() {
    const url = $scope.apiUrl + $scope.noteTitle;
    $http.get(url).then(function(response){
      $scope.noteText = response.data.text;
      console.log($scope.noteText);
    },
     function(response) {
      if (response.status == 404) {
        $scope.createNote();
      }
    });
  };


  $scope.createNote = function() {
    $http.post($scope.apiUrl, {title: $scope.noteTitle , text: '' }).then(function(response){
      $scope.noteText = response.data.text;
      console.log(response);
    });
  }
  $scope.getNote();

}
