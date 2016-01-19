define([], function() {
   var ngLoader = function(path, ngApp, callback) {
     var components = getFilePathsRecursive(path);

    require(components, function(){
      for (var arg in arguments) {
        if (typeof arguments[arg] == "function") {
          arguments[arg](ngApp);
        }
      }
      callback();
    })
  }

  var getFilePathsRecursive = function(path) {
    var totalPaths = [];

    var fs        = nodeRequire('fs');

    if (fs.existsSync(path)) {
      if (fs.lstatSync(path).isFile()) {
        totalPaths.push(path);
      } else {
        var files     = fs.readdirSync(path);
        var fileCount = files.length;

        for (var i = 0; i < fileCount; i++) {
          var absolutePath = path + '/' + files[i];

          var fileStats    = fs.statSync(absolutePath);
          if (fileStats.isDirectory()) {
            var subFiles = getFilePathsRecursive(absolutePath);
            totalPaths = totalPaths.concat(subFiles);
          } else {
            if (files[i].indexOf(".js", files[i].length - 3) !== -1) {
              totalPaths.push(absolutePath);
            }
          }
        }
      }
    }

    return totalPaths;
  }

  return ngLoader;
});
