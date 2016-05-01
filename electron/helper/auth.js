var ipc     = require("electron").ipcMain; // electron event  handler 
var request = require('request');
var valence = require(__dirname + '/../valence.js');

var AuthHelper = function(api, id, config) {
  this.api    = api;
  this.id     = id;
  this.config = config;
};

AuthHelper.prototype.login = function(event, id) { 
  var user       = valence.status[id].user;
  var config     = this.config;

  console.log('Login        : ' + id);

  var that = this;
  if (!user) {
    console.log('Authorize    : ' + id);
    that.autorize(config, function(err, code) {
      if (err) {
        that.loginFail(event, config, err);
      } else {
        console.log('Authenticate : ' + id);
        that.authenticate(code, config, function(err, user) {
          if (err) {
            that.loginFail(event, id, err);
          } else {
            valence.set_user(user, id, function() {
              that.loginSuccess(event, id, user);
            });
          }
        });
      }
    });
  } else {
    console.log('User loaded  : ' + id + ' user successfully loaded!');
    that.loginSuccess(event, id, user);
  }
};

AuthHelper.prototype.autorize = function(options, callback) {
  //display popup used to show a small facebook login
  var authUrl = options.authorizeUrl + '?client_id=' + options.client_id + '&scope=' + options.scopes;
  if (options.redirect_uri) {
    authUrl += '&redirect_uri=' + options.redirect_uri;
  }

  if (options.additionalParams) {
    for (var param in options.additionalParams) {
      authUrl += '&' + param + '=' + options.additionalParams[param];
    }
  }

  this.handleAuthWindow(authUrl, callback);
};

AuthHelper.prototype.handleAuthWindow = function(url, callback) {
  var callbackCalled = false;
  var BrowserWindow  = require('browser-window');

  // Build the OAuth consent page URL
  var authWindow = new BrowserWindow({ 
    'title'  : 'Valence Authentication...',
    'icon'   : 'D:/projects/tschuck/valence-apps/node_modules/valence-bond/public/icon/valence.png',
    'width'  : 500,
    'height' : 600,
    'use-content-size': true,
    'center': true,
    'resizable': false,
    'always-on-top': true,
    'standard-window': false,
    'auto-hide-menu-bar': true,
    'node-integration': false
  });

  authWindow.webContents.session.clearStorageData({ storages : 'cookies' }, function() {
    authWindow.loadURL(url);
    authWindow.show();

    // Handle the response from
    authWindow.webContents.on('did-get-redirect-request', function(event, oldUrl, newUrl) {
      var raw_code  = /code=([^&]*)/.exec(newUrl) || null;
      var code      = (raw_code && raw_code.length > 1) ? raw_code[1] : null;
      var error     = /\?error=(.+)$/.exec(newUrl);

      // If there is a code in the callback, proceed to get token from github
      if (code) {
        callback(null, code);
      } else if (error) {
        callback(error, null);
      }
      if (code || error) {
        callbackCalled = true;
        // Close the browser if code found or error
        authWindow.close();
      }
    });

    // Reset the authWindow on close
    authWindow.on('close', function() {
      if (!callbackCalled) {
        callback('Authentication windows was closed without authentication.', null);
      }
      authWindow = null;
    }, false);
  })
};

AuthHelper.prototype.authenticate = function(code, options, callback) {
  var form = {
    client_id: options.client_id,
    client_secret: options.client_secret,
    code: code,
  };
  if (options.redirect_uri) {
    form.redirect_uri = options.redirect_uri;
  }

  request.post({
    url : options.authenticateUrl, 
    form : form
  }, function(error, response, body) {
    if (!error && typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch(ex) {
        error = ex;
      }
    }

    if (!error) {
      callback(null, body);
    } else {
      callback(error, false);
    }
  });
};

AuthHelper.prototype.refresh = function() {

};

AuthHelper.prototype.logout = function(event, id) {
  valence.set_user(false, id, function(err) {
    event.sender.send('logout_' + id, true);
    this.api.app.on.logout();
  }.bind(this));
};

AuthHelper.prototype.loginSuccess = function(event, id, user) {
  event.sender.send('login_success_' + id, user);
  this.api.app.on.login(null, user);
};

AuthHelper.prototype.loginFail = function(event, id, err) {
  event.sender.send('login_fail_' + id, err);
  this.api.app.on.login(err, null);
};

module.exports = AuthHelper;
