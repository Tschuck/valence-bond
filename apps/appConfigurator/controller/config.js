define([
  'css!./../../../public/css/angular-awesome-slider.min.css',

  'css!./config.css'
], function() {
  return function(ngApp) {
    ngApp.controller('config', function($scope) {
      var ipc  = nodeRequire("ipc");
      $scope.apps   = [ ];
      $scope.status = { };

      $scope.calcSize = function() {
        var appCount = Object.keys($scope.apps).length;
        if (appCount > 1) {
          $scope.width  = 380;
          $scope.size = { 
            'min-width'  : $scope.width + 'px'
          };
        }
      };

      ipc.on('valence_status', function(status) {
        $scope.status = status;
        $scope.$apply();
      });

      ipc.on('valence_apps', function(apps) {
        $scope.apps = apps;
        delete $scope.apps.appConfigurator;
        delete $scope.apps.appContainer;
        $scope.calcSize();
        $scope.$apply();
      });

      ipc.send('appConfigurator_loaded', {});
    });
  }
});
