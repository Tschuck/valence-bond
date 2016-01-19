define([
  'css!./beautyOnOff.css'
], function() {
  return function(ngApp) {
    ngApp.directive('beautyOnOff', function() {
      return {
        restrict   : 'E',
        replace    : true,
        templateUrl: __dirname + '/directives/beautyOnOff/beautyOnOff.html',
        scope : {
          ngModel : '=ngModel'
        },
        link : function($scope, $element, $attrs) {
          if ($scope.ngModel) {
            $scope.ngModel = true;
          } else {
            $scope.ngModel = false;
          }
        }
      }
    })
  };
})
