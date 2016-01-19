var fs    = require('fs');
var async = require('async');

var createElectronApp = function(metadata, version, source, output, callback) {
  var packager = require('electron-packager');
  var opts = {
    name      : metadata.name,
    version   : version,
    icon      : metadata.setup_icon,
    dir       : source,
    out       : output,
    platform  : metadata.platform,
    arch      : 'all',
    asar      : true,
    overwrite : true
  };

  packager(opts, function(err, path) {
    callback(err, path);
  });
};

var createInstallers = function(metadata, path, callback) {
  var folderName = metadata.name;

  createInstaller(metadata, path + '/' + folderName + '-win32-ia32', path + '/install/win32-ia32', function() {
    createInstaller(metadata, path + '/' + folderName + '-win32-x64',  path + '/install/win32-x64', callback);
  });
};

var createInstaller = function(metadata, source, output, callback) {
  var squirrel       = require('electron-installer-squirrel-windows');
  var callbackCalled = false;
  squirrel({
    path         : source, 
    out          : output,
    name         : metadata.name,
    product_name : metadata.title,
    description  : metadata.description,
    authors      : metadata.author,
    owners       : metadata.author,
    overwrite    : true
    //setup_icon   : metadata.setup_icon
  }, function (err) {
    if (!callbackCalled) {
      callbackCalled = true;
      callback(err);
    }
  });

  var checkSetupExe = function() {
    if (fs.existsSync(output + '/Setup.exe')) {
      if (!callbackCalled) {
        setTimeout(function() {
          callbackCalled = true;
          callback();
        }, 3000);
      }
    } else {
      setTimeout(function() {
        checkSetupExe();
      }, 300);
    }
  };

  //checkSetupExe();
};

var readPackageJSON = function(source) {
  var path = source + '/package.json';
  
  var buildReturnValue = function(data) {
    if (!data) {
      data = { };
    }
    return {
      name        : data.name        || 'Valence App',
      title       : data.title       || 'Valence App',
      version     : data.version     || '0.0.1',
      description : data.description || 'An application for valence-bond.',
      author      : data.author      || 'Tschuck',
      owners      : data.author      || 'Tschuck',
      setup_icon  : __dirname + '/public/icon/valence.ico'
    }
  };

  if (fs.existsSync(path)) {
    try {
      var packageData = require(path);
      return buildReturnValue(packageData);
    } catch(ex) {
      return buildReturnValue();
    }
  } else {
    return buildReturnValue();
  }
};

module.exports = function(electronVersion, platform, source, output, callback) {
  console.log('Start packaging for Valence-Bond application...');
  console.log('...reading package.json');

  var metadata = readPackageJSON(source);
  metadata.platform = platform;

  console.log('...detected metadata : ');
  for (var param in metadata) {
    console.log('     - ' + param + ' : ' + metadata[param]);
  }

  console.log('');
  console.log('...Start packaging'); 
  console.log('-------------------');
  createElectronApp(metadata, electronVersion, source, output, function(err, path) {
    if (err) {
      console.log('Error during package creation:');
      console.log(' - ' + err);
      return callback(err, output);
    } else {
      console.log('...package was successfully created!')
      console.log('    lookup path : ' + path);
    }
    console.log('-------------------'); console.log('');

    if (process.platform === 'win32') {
      console.log('');
      console.log('... Windows platform detected! Building installer!');
      console.log('--------------------------------------------------');
      createInstallers(metadata, output, function(err) {
        if (err) {
          console.log('Error during installer creation:');
          console.log(' - ' + err);
        } else {
          console.log(' ...installer was successfully created!')
          console.log('    lookup path : ' + output + '/win32-x64');
        }

        console.log('--------------------------------------------------');

        callback(err, output);
      });
    } else {
      callback(err, output);
    }
  });
};