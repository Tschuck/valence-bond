var ipc         = require("electron").ipcMain;
var valence     = require(__dirname + '/../valence.js');
var shortcuts   = require('global-shortcut');
var onToggleValence = []; 

var EventHelper = function(api, id) {
  var self = this;
  self.id  = id;
  self.api = api;

  if (self.id === 'appContainer') {
    valence.appContainer = self.api.app;
  }

  onToggleValence.push(valence.toggle_valence.bind(valence, api.window, id));

  shortcuts.register('f1', function() {
    for (var i = 0; i < onToggleValence.length; i++) {
      onToggleValence[i]();
    }
  });

  this.bindIDEvent('window_resize', function(event, obj) {
    //set new size, if config is hard coded
    obj = api.window.resize(event, obj);
    api.app.on.resize(obj.width, obj.height);
  });

  this.bindIDEvent('window_move', function(event, obj) {
    api.window.move(event, obj);
    api.app.on.move(obj.x, obj.y);
  });

  this.bindIDEvent('finished_window_loading', function(event) {
    valence.appContainer.removeLoading(self.id);
    api.app.on.finishLoading();
  });

  this.bindIDEvent('app_toggle_active', function(event, obj) {
    valence.toggle_active(event, self.id, api.window, function(active) {
      if (active) {
        api.app.on.activate();
      } else {
        api.app.on.deactivate();
      }
    });
  });

  this.bindIDEvent('app_toggle_shown', function(event, obj) {
    valence.toggle_shown(event, self.id, api.window, function(shown) {
      if (shown) {
        api.app.on.show();
      } else {
        api.app.on.hide();
      }
    });
  });

  this.bindIDEvent('login', function(event, obj) {
    api.auth.login(event, self.id);
  });

  this.bindIDEvent('logout', function(event, obj) {
    api.auth.logout(event, self.id)
  });
};

EventHelper.prototype.bindIDEvent = function(eventName, callback) {
  ipc.on(eventName, function(event, obj) {
    if ((this.id === obj) || (this.id === obj.id)) {
      callback(event, obj);
    }
  }.bind(this));
};

module.exports = EventHelper;