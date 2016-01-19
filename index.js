//Load the initial scripts, to provide an functional and minmal interface to start / build an application 
var start = require(__dirname + '/electron/start.js');
var build = require(__dirname + '/electron/build.js');

//release the basic functions to start Valence Bond
module.exports = {
  run   : start,
  build : build
};
