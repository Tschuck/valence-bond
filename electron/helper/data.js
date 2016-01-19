var fs     = require("fs"); 
var ipc    = require('ipc'); // electron event  handler 
var mkdirp = require('mkdirp');

var DataManager = function(id) {
  this.id         = id;
  this.userHome   = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
  this.dataFolder = this.userHome + '/valence';
  this.path       = this.dataFolder + '/' + id + '.json';
}

/* Loading base data and user data. */
DataManager.prototype.ensureSaveFolder = function(callback) {
  var that = this;
  mkdirp(this.dataFolder, function(err) { 
    callback.call(that);
  });
};

//************************** loading logic /**************************/
DataManager.prototype.load = function(callback, defaultValue) {
  this.ensureSaveFolder(function() {
    if (fs.existsSync(this.path)) {
      fs.readFile(this.path, 'utf8', function (err, data) {
        if (err) {
          return console.log(err);
        }
        try {
          data = JSON.parse(data);
        } catch(ex) {  }
        callback(data, err);
      });
    } else {
      this.save(defaultValue || { }, function(err) {
        callback(defaultValue || { }, err);
      })
    }
  });
}

/************************** saving logic **************************/
DataManager.prototype.save = function(data, callback) {
  this.ensureSaveFolder(function() {
    if (typeof data !== "undefined" && typeof data !== "string") {
      data = JSON.stringify(data);
    }
    fs.writeFile(this.path, data, function(err) {
      if(err) {
        return console.log(err);
      }
      callback(err);
    }); 
  });
};

module.exports = DataManager;