var ipc = require('ipc'); 

module.exports = function() {
  var self        = this;
  var status      = { };
  var loaded      = false;
  var loadedApps  = { };
  var loadingApps = { };

  self.showLoading = function(id) {
    self.sendToWindow('show_loading', id);
  };

  self.removeLoading = function(id) {
    self.sendToWindow('remove_loading', id);
  };

  self.setNotification = function(id) {

  };
};