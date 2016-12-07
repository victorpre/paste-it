angular.module('pasteit', ['pasteit.controllers','pasteit.services','ngRoute'])
    .config(["$routeProvider","$locationProvider",function($routeProvider,$locationProvider){
        $locationProvider.html5Mode(true);
            $routeProvider
            .when("/:noteTitle",{
                templateUrl: "views/other.html",
                controller: "OtherCtlr"
            })
            .when("/",{
                templateUrl: "views/home.html",
                controller: "MainCtlr"
            });
}]);
