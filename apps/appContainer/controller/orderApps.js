define([
  'css!./appManager.css'
], function() {
  return function(ngApp) {
    ngApp.filter('orderApps', function() {
      return function(items) {
        var filtered = [];
        angular.forEach(items, function(item) {
          filtered.push(item);
        });
        filtered.sort(function (a, b) {
          return (a.config.order > a.config.order ? 1 : -1);
        });
        filtered.reverse();
        return filtered;
      };
    });
  }
});