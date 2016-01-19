define([
  'css!./appManager.css'
], function() {
  return function(ngApp) {
    ngApp.controller('appManager', function($scope) {
      var ipc     = nodeRequire("ipc");

      $scope.init = function() {
        $scope.apps   = { };
        $scope.status = { };
        $scope.calcSize();
        ipc.send('appContainer_loaded', {});
      };

      $scope.calcSize = function() {
        var appCount = 0;
        for (app in $scope.apps) {
          if ($scope.status[app].active) {
            appCount++;
          }
        }
        $scope.width  = (appCount * 125) + 10;
        $scope.size = { 
          'min-width'  : $scope.width + 'px'
        };
      };

      $scope.toggleConfig = function() {
        $scope.calcSize();
      };

      ipc.on('valence_status', function(status) {
        $scope.status = status;
        $scope.calcSize();
        $scope.$apply();
      });

      ipc.on('valence_apps', function(apps) {
        $scope.apps = apps;
        delete $scope.apps.appContainer;
        $scope.calcSize();
        $scope.$apply();
      });

      ipc.on('toggle_app_active', function(id) {
        for (app in $scope.apps) {
          if ($scope.apps[app].config.id === id) {
            var status = $scope.status[app];
            if (status.active) {
              $scope.hideApp(status);
            } else {
              $scope.showApp(status);
            }
            return;
          }
        }
      });

      $scope.hideApp = function(status) {
        status.hide = true;
        $scope.$apply();
        setTimeout(function() {
          status.active = false;
          $scope.calcSize();
          $scope.$apply();
        }, 500);
      };

      $scope.showApp = function(status) {
        status.active = true;
        status.hide   = false;
        $scope.calcSize();
        $scope.$apply();
      };

      $scope.init();
    });
  }
});