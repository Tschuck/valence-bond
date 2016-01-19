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
        controller : function($scope) {
          var wasActivatedForAuth = false;
          $scope.toggleAppStatus = function() {
            if ($scope.config.auth && !$scope.status.user && $scope.status.active) {
              ipc.send('login', $scope.config.id);
              $scope.status.active = false;
              wasActivatedForAuth  = true;
              return;
            } else {
              wasActivatedForAuth = false;
              ipc.send('app_toggle_active', $scope.config.id);
            }
          };

          $scope.logout = function() {
            ipc.send('logout', $scope.config.id);
          };

          ipc.on('login_success_' + $scope.config.id, function(user) {
            $scope.status.user = user;
            if (wasActivatedForAuth) {
              $scope.status.active = true;
              ipc.send('app_toggle_active', $scope.config.id);
            }
            $scope.$apply();
          });

          ipc.on('login_fail_' + $scope.config.id, function(err) {
            $scope.status.user   = false;
            wasActivatedForAuth  = false;
            $scope.status.active = false;
            $scope.$apply();
          });

          ipc.on('logout_' + $scope.config.id, function() {
            if ($scope.status.active) {
              wasActivatedForAuth  = false;
              $scope.status.active = false;
              ipc.send('app_toggle_active', $scope.config.id);
            }
            $scope.status.user = false;
            $scope.$apply();
          });
        }
      }
    })
  };
})
