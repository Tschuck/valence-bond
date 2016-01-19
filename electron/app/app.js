var valence     = require(__dirname + '/../valence.js');
var AppApi      = require(__dirname + '/api.js');

var Window      = require(__dirname + '/../helper/window.js');
var Logger      = require(__dirname + '/../helper/log.js');
var DataHelper  = require(__dirname + '/../helper/data.js');
var EventHelper = require(__dirname + '/../helper/events.js');
var AuthHelper  = require(__dirname + '/../helper/auth.js'); 

var App = function(path) {
  this.config      = loadConfig(path);
  this.config.path = path;
  this.config.icon = this.config.path + '/' + this.config.icon;

  valence.ensureAppInStatus(this.config.id);
};

App.prototype.initialize = function() {
  var api = { };
  api.log    = new Logger(this.config.id);
  api.app    = new AppApi(api,     this.config.id);
  api.data   = new DataHelper(this.config.id);
  api.window = new Window(api,     this.config);
  api.auth   = new AuthHelper(api, this.config.id, this.config.auth);
  
  runIndexJS.call(this, api);

  api.events = new EventHelper(api, this.config.id);

  var currStatus = valence.status[this.config.id];
  if (currStatus.active && currStatus.shown && currStatus.valence) {
    api.window.show();
  }
};

var loadConfig = function(path) {
  return require(path + '/config.js');
};

var runIndexJS = function(api) {
  try {
    require(this.config.path + '/index.js').call(api.app, this.config);
  } catch(ex) { 
    api.log.error('Unable to load index.js : ' + ex);
  }
};

module.exports = App;