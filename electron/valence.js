var ipc        = require('ipc');
var Menu       = require('menu');
var Tray       = require('tray');
var dataHelper = require(__dirname + '/helper/data.js');

var Valence = function(callback) {
  var self = this;

  self.loaded = {
    configurator : false,
    container    : false
  };

  ipc.on('appConfigurator_loaded', function(event) {
    self.loaded.configurator = event.sender;
    checkStatus.call(self);
  });

  ipc.on('appContainer_loaded', function(event) {
    self.loaded.container = event.sender;
    checkStatus.call(self);
  });

  self.dataHelper = new dataHelper('valence_status');
};

Valence.prototype.initialize = function(electronApplication, callback) {
  var self = this;
  self.app = electronApplication;

  self.createTray();
  load.call(this, function(status) {
    self.status = status;
    callback();
  });
};

Valence.prototype.createTray = function() {
  var path = require('path');
  this.appIcon     = new Tray(path.normalize(__dirname + '/../public/icon/48.png'));
  this.contextMenu = Menu.buildFromTemplate([ 
    { label: 'Close', click : this.shutdown.bind(this) }
  ]);
  this.appIcon.setToolTip('Valence-Bond for Electron.');
  this.appIcon.setContextMenu(this.contextMenu);
};

Valence.prototype.applyApps = function(apps) {
  this.apps = apps;
  checkStatus.call(this);
};

Valence.prototype.toggle_valence = function(window, id) {
  this.status[id].valence = !this.status[id].valence;

  if (this.status[id].valence && this.status[id].active && this.status[id].shown) {
    window.show();
  } else {
    window.hide();
  }

  save.call(this);
};

Valence.prototype.toggle_active = function(event, id, window, callback) {
  this.status[id].active = !this.status[id].active;

  this.loaded.container.send('toggle_app_active', id);
  if (this.status[id].active && this.status[id].shown) {
    window.show();
  } else {
    window.hide();
  }
  save.call(this, function(active) {
    callback(active);
  }.bind(this, this.status[id].active));
};

Valence.prototype.toggle_shown = function(event, id, window, callback) {
  this.status[id].shown = !this.status[id].shown;
  window.toggle();
  
  save.call(this, function(shown) {
    callback(shown);
  }.bind(this, this.status[id].shown));
};

Valence.prototype.set_user = function(user, id, callback) {
  this.status[id].user = user;
  save.call(this, callback);
};

Valence.prototype.ensureAppInStatus = function(id) {
  if (!this.status[id]) {
    this.status[id] = {
      valence : true,
      active  : false,
      shown   : false,
      user    : false
    };
    if (!this.status.appContainer.valence) {
      this.status[id].valence = false;
    }
  } 
};

Valence.prototype.shutdown = function() {
  this.app.quit();
};

var load = function(callback) {
  this.dataHelper.load(function(status) {
    if (callback) callback(status);
  }, {  
    appConfigurator : { valence : true, active : true, shown : false, user : false }, 
    appContainer    : { valence : true, active : true, shown : true,  user : false  }
  });
};

var save = function(callback) {
  this.dataHelper.save(this.status, function() {
    if (callback) callback();
  });
};

var checkStatus = function() {
  if (this.apps && this.loaded.configurator && this.loaded.container) {
    var apps = [ ];
    this.loaded.configurator.send('valence_status', this.status);
    this.loaded.configurator.send('valence_apps', this.apps);
    
    this.loaded.container.send('valence_status', this.status);
    this.loaded.container.send('valence_apps', this.apps);    
  }
};

module.exports = new Valence();