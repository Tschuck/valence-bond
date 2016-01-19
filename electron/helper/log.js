var Logger = function(id) {
  this.id = id;
};

var log = function(id, type, text) {
  var message = this.messages[text] ? this.messages[text] : text;
  console.log('[Valence - ' + type + '][' + id + '] : ' + message);
};

Logger.prototype.info = function(text) {
  log.call(this, this.id, 'info', text);
};

Logger.prototype.error = function(text) {
  log.call(this, this.id, 'error', text);
};

Logger.prototype.messages = {
  'newWindow' : 'Initiale new Window'
};

module.exports = Logger;