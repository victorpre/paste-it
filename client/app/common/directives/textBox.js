angular.module('typeonme')
  .directive('textBox', ['$timeout', function($timeout) {
  return {
    link: function($scope, element, attrs){
      $timeout(function() {
        element.trigger('autoresize');
      });
    }
  };
}])
