define([
  'css!./app.css'
], function() {
  return function(ngApp) {
    ngApp.directive('app', function() {
      return {
        restrict   : 'E',
        replace    : true,
        templateUrl: __dirname + '/directives/app/app.html',
        scope : {
          config : '=config',
          status : '=status'
        },
        link : function($scope, $element, $attrs) {
          $scope.loading = $scope.status.loading || false;
          $scope.start = function() {
            ipc.send('app_toggle_shown', $scope.config.id);
          };

          ipc.on('show_loading', function(id) {
            if (id === $scope.config.id) {
              $scope.loading = true;
              $scope.$apply();
            }
          });

          ipc.on('remove_loading', function(id) {
            if (id === $scope.config.id) {
              $scope.loading = false;
              $scope.$apply();
            }
          });
        }
      }
    })
  };
})
