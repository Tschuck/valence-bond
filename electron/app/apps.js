var App    = require(__dirname + '/app.js');
var fs        = require('fs');
var async     = require('async'); 
var ipc       = require('ipc');
var shortcuts = require('global-shortcut');

var loadApps = function(paths, appsToLoad, callback) {
  var apps = { };
  async.each(paths, function(path, next) {
    var folders = fs.readdirSync(path);
    async.each(folders, function(folder, next) {
      var folderPath = path + '/' + folder;
      /* if the element is an directory */
      if (fs.statSync(folderPath).isDirectory()) {
        /* get all files and test if it contains an index.html */
        if (2 == fs.readdirSync(folderPath).filter(function(file) {
          return ((file == "index.html") || file == "config.js");
        }).length) {
          /* create a new window */
          var app = new App(folderPath);
          if (appsToLoad.indexOf(app.config.id) !== -1) {
            app.initialize();
            apps[app.config.id] = app;
          }
        }
      }
      next();
    }, function() {
      next();
    });
  }, function() {
    callback(apps);
  });
};

var apps = { };

module.exports = {
  load : function(paths, appsToLoad, callback) {
    loadApps([ __dirname + '/../../apps' ], [ 'appContainer', 'appConfigurator' ], function(apps) {
      loadApps(paths, appsToLoad, function(loadedApps) {
        for (var app in loadedApps) {
          apps[app] = loadedApps[app];
        }
        callback(apps);
      });
    });
  },
  get : function(callback) {
    callback(apps);
  }
};