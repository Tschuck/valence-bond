module.exports = function(paths, appsToLoad, callback) {
  if(require('electron-squirrel-startup')) {
    //require(__dirname + '/install.js');
    
    return;
  }

  var valence = require(__dirname + '/valence.js');
  var app     = require('app'); // Module to control application life.

  // Report crashes to our server.
  require('crash-reporter').start();

  // Quit when all windows are closed.
  app.on('window-all-closed', function() {
    if (process.platform != 'darwin') {
      app.quit();
    }
  });

  // This method will be called when atom-shell has done everything
  // initialization and ready for creating browser windows.
  app.on('ready', function() {
    var apps = require(__dirname + '/app/apps.js');
    valence.initialize(app, function() {
      apps.load(paths, appsToLoad, function(apps) {
        valence.applyApps(apps);

        if (callback) {
          callback();
        }
      });
    });
  });
}