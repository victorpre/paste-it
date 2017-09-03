angular.module('typeonme').config([
  '$routeProvider',
  '$locationProvider',
  function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider
      .when("/notes/:noteTitle",{
        templateUrl: "/notes/show.html",
        controller: "NotesController"
      })
      .when("/",{
        templateUrl: "home/home.html",
        controller: "HomeController"
      });

    $routeProvider.otherwise('/');
  }
]);
