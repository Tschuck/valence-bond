var valence = require(__dirname + '/../valence.js'); 

var AppApi = function(api, id) {
  this.id  = id;
  this.api = api;

  this.log = this.api.log;
};

//default events that can be used by an app
AppApi.prototype.on = {
  finishLoading : function() { },
  resize        : function(width, height) { },
  move          : function(x, y) { },
  activate      : function() { },
  deactivate    : function() { },
  show          : function() { },
  hide          : function() { },
  login         : function(err, user) { },
  logout        : function() { },
  close         : function() { }
};

//Shows or hides the loading animation for the current application.
//@param boolean state If the value is true, the loading animation will start (when it's not allready started)
//                     If the value is false, the loading animation will end. 
AppApi.prototype.loading = function(state) {
  if (valence.appContainer) {
    if (state) {
      valence.appContainer.showLoading(this.id);
    } else {
      valence.appContainer.removeLoading(this.id);
    }
  }
};

//Sends data from the backend application to the frontend components.
//Use require('ipc') to recieve the event in the frontend.
AppApi.prototype.sendToWindow = function(event, data) {
  if (this.api.window.window) {
    this.api.window.window.webContents.send(event, data);
  }
};

//Saves app specific data.
//@param object   data      The JSON Object that should be saved.
//@param function callback  Function that is called, when the data was saved.
AppApi.prototype.save = function(data, callback) {
  this.api.data.save(data, function(err) {
    callback(err);
  });
};

//Loads app specific data.
AppApi.prototype.load = function(callback, defaultValue) {
  this.api.data.load(function(data, err) {
    callback(data, err);
  }, defaultValue);
};

AppApi.prototype.getUser = function() {
  if (valence.status[this.id].user) {
    return valence.status[this.id].user;
  }
};

//Sends a get request.
//If a accessToken was proviced, the Bearer Authentication header will be appended.
AppApi.prototype.getRequest = function(url, callback, accessToken) {
  var that = this;
  var headers = {
    'Accept': 'application/json; odata=verbose',
    'content-type': 'application/json;odata=verbose'
  };
  if (accessToken) {
    headers.Authorization = 'Bearer ' + accessToken
  };

  this.showLoading();
  request.get({
    url: url,
    headers: headers
  }, function (error, response, body) {
      try {
        body = JSON.parse(body);
      } catch(ex) { }

    that.removeLoading();
    callback(error, response, body);
  });
};

module.exports = AppApi;