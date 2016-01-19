console.log('View loading animation');
setTimeout(function() {}, 13000);

/*var squirrelCommand = process.argv[1];
var fs              = require('fs');
var path            = require('path');

var deleteFolderRecursive = function(path) {
  if( fs.existsSync(path) ) {
    fs.readdirSync(path).forEach(function(file,index){
      var curPath = path + "/" + file;
      if(fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

var executeSquirrelCommand = function(args, done) {
  var updateDotExe = path.resolve(path.dirname(process.execPath), 
     '..', 'update.exe');
  var child = cp.spawn(updateDotExe, args, { detached: true });
  child.on('close', function(code) {
     done();
  });
};

switch (squirrelCommand) {
  case '--squirrel-install':
  case '--squirrel-updated':
    var target = path.basename(process.execPath);
    executeSquirrelCommand(["--createShortcut", target], app.quit);

    return true;
  case '--squirrel-uninstall':
    var dataHelper = new require(__dirname + '/data.js')('');
    deleteFolderRecursive(dataHelper.dataFolder);

    var target = path.basename(process.execPath);
    executeSquirrelCommand(["--createShortcut", target], app.quit);

    return true;
  case '--squirrel-obsolete':

    app.quit();
    return true;
};
*/