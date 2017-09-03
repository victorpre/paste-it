angular.module('typeonme').controller('HomeController', ['$scope', '$http', '$routeParams', HomeController])


function HomeController($scope, $http, $routeParams) {
  $(document).ready(function(){
    $('.parallax').parallax();
  });
}
