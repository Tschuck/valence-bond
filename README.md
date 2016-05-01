# Valence-Bond for [Electron](https://github.com/atom/electron.git) #
The project is in an early development status, is developed for my own purposes and only tested with windows. Feel free to report bugs and new features.

## 1. Overview
Electron is an mighty and extensive library to build environment independent desktop applications.
However, the way to your own, matured application is time-consuming and exhausting. At the beginning of every project you need to fullfill annoying and repeating tasks like the following: 

  - create project & directory structure
  - file handling / save & load logic
  - frontend to backend communication
  - request-handling
  - authentication
  - logging
  - app management
  - basic libraries & configuration

Valence-Bond masters this project requirements by acting as an app container / configurator using the power of [Electron](https://github.com/atom/electron.git). It's eays to create your own isolated project environment to start very fast with your project.

Valence-Bond will help you by the already mentioned taks and with the following : 

  - build a controlled widget dashboard
  - build a single application, with isolated electron windows to simulate application click through
  - OAuth2 authentication (login / logout)
  - frontend library that is working with angular and requireJS

![alt tag](https://github.com/Tschuck/valence-sample/raw/master/valence_bond_sample.png)

## 2. Installation
Create an empty project folder or clone this [Valence-Sample-Project](https://github.com/Tschuck/valence-sample) to start developing.
Install valence-bond and the electron-prebuilt package: 

```javascript
  npm install valence-bond
  npm install -g electron-prebuilt
```

Notice : <b>Please clone the project in to your node_modules, currently no npm version exists.</b>

Require the valence start script and be sure to load it with the absolute path. 
Without this, the application may not run successfully when it was build. 

```javascript
  var valence = require(__dirname + '/node_modules/valence-bond/index.js');
  valence.run([ __dirname + '/apps' ], [ ]);
```

The valence.run function starts the application and accepts two parameters. 
  
  1. contains an array of all paths, where valence-bond should look for applications. 
  2. contains an array, that includes the names of the applications (folder-names).

If you don't add any applications, only the valence-bond app container and - configurator will be loaded.

## 3. App Development
A Valence-Bond application need 3 files to start an application :

  - config.js
  - index.js
  - index.html

Watch up this repository to lookup a sample project with the latest code samples: <br>
[Valence-Sample](https://github.com/Tschuck/valence-sample)

If the documentation is not detailed enough, please visit the [electron-documenation](https://github.com/atom/electron/tree/master/docs). 

### 3.1 Config.js
```javascript
  module.exports = {
    id      : 'sample',             //valence-bond app id
    name    : 'Sample Application', //display name of application (if needed)
    icon    : '/img/sample.png',    //icon of the application
    devMode : false,                //true opens chrome developer tools in a new window
    order   : 1,                    //order for the apps in the app container

    //authentication configuration
    //is used to start a oauth2 authentication
    //If this configuration is used, an app can only be started, when the user was authenticated
    auth    : {
      authorizeUrl    : 'https://sampleAuth.com/oauth2/authorize',
      authenticateUrl : 'https://sampleAuth.com/oauth2/access_token', 
      client_id       : 'my-client-id',
      client_secret   : 'my-client-secret',
      scopes          : [ ] // Scopes limit access for OAuth tokens.
    },

    //electron window configuration (new BrowserWindow)
    window : { 
      type            : 'splash',
      "always-on-top" : true,
      "skip-taskbar"  : true,
      
      //position of the window
      //can be on of the following possibilities
      //x : "100px"
      //x : "10%"
      //x : "100% - 300px" //be sure, that each location and arithmetic operator is seperated with a space (only + and - supported)
      x               : "25%",
      y               : "25%", 

      // valence-bond will auto size your application with the body size (if the frontend library is used)
      width           : 0,
      height          : 0,      

      "overlay-scrollbars" : false,
      "always-on-top"      : true, 
      resizable            : false,

      transparent     : true,
      frame           : false
    }
  };
```

### 3.2 Index.js
The index.js file is the backend entry point for your application. You can use the following functions:
```javascript
  var ipc = require("electron").ipcMain; 

  module.exports = function(config) {
    var self = this;

    //show the loading animation for my application in the app container
    self.loading(true);

    //hide the loading animation
    self.loading(false);

    self.log.info('info message, my index.js file was loaded!');
    self.log.error('logged a sample error');

    //receives a event from frontend
    ipc.on('sample_frontend_message', function(event, message) {
      self.log.info(message);
    });

    //load app specific data, you can also specify a default obj, that should be initially saved
    self.load(function(data) {
      self.log.info(data.defaultObj);

      data.iWasSaved = true;
      self.save(data, function(error) {
        self.log.error(error);
      });
    }, { defaultObj : 'im a sample app' });

    // self.getRequest('mysample.url', function(error, response, body) {
    //   self.log.error(error);
    //   self.log.info(response);
    //   self.log.info(body);
    // }, self.getUser().access_token);

    //valence bond events
    self.on.finishLoading = function() { 
      //sends a event to the frontend, when the frontend was loaded
      self.sendToWindow('hello_frontend', 'Message from your index.js file :)');
      self.log.info('the window was successfully loaded');
    };
    self.on.resize = function(width, height) { 
      self.log.info('window was resized to [' + width + '|' + height + ']');
    };
    self.on.move  = function(x, y) { 
      self.log.info('window was moved to [' + x + '|' + y + ']');
    };
    self.on.activate  = function() {
      self.log.info('window was activated');
    };
    self.on.deactivate = function() {
      self.log.info('window was deactivated');
    };
    self.on.show = function() { 
      self.log.info('window was shown');
    };
    self.on.hide = function() { 
      self.log.info('window was hided');
    };
    self.on.login = function(err, user) { 
      self.log.info('user was logged in');
    };
    self.on.logout = function() { 
      self.log.info('user was logged out');
    };
    self.on.close = function() {
      self.log.info('application will shut down');
    };
  };
```

## 3.3 index.html
The index.html file is the main entry point for your frontend application window.
By loading the valence-bond init.js file, require.js and angular.js will be loaded. 
<br>
It will also look for js files in the "controller" and "directive" folder to load angular components. Here is a short sample of a controller :

```javascript
  define([
    'css!./sample.css'
  ], function() {
    return function(ngApp) {
      ngApp.controller('sample', function($scope) {
        //the backend require was saved to the nodeRequire variable, to load backend modules
        //use define / require for the frontend require.js usage
        var ipc  = nodeRequire("ipc");

        $scope.message = '';

        ipc.on('hello_frontend', function(message) {
          $scope.message = message;
          ipc.send('sample_frontend_message', message);
          $scope.$apply();
        });
      });
    }
  });
```

```HTML
  <!DOCTYPE html>
  <html>
    <head>
      <title>Sample Application</title>
      <!-- Load the valence-bond frontend library to load require.js and angular.js -->
      <script src="../../node_modules/valence-bond/public/init.js"></script>
    </head>
    <body ng-controller="sample">
      Sample application for <b> Valence Bond</b>
      Message from backend : {{message}}
    </body>
  </html>
```
<br>
Please notice : <b>Wihout the init.js script, no resize, move and finish-loading events are fired, that can be used in the index.js file.</b> 

## 4. Build & Package
The build process of valence-bond uses [electron-packager](https://github.com/maxogden/electron-packager) and [electron-installer-squirrel-windows](https://github.com/mongodb-js/electron-installer-squirrel-windows), that allows to created isolated packages for each enviroment and to create windows installers.

Add a build.js file in your root folder of your project:
```javascript
  var valence   = require('valence-bond');
  var buildPath = __dirname + '/../valence-bond-build';

  //start the build process
  //  specify the electron version
  //              platform (linux, win32, darwin, all)
  //              source directory (be sure that the source folder is not located in your application path, the package size will be increased recursively)
  //              output directory 
  //              callback function
  valence.build('0.36.3', 'win32', __dirname, buildPath, function(error, path) {
    console.log('Finished valence sample app building!');
  });
```

Please notice:
<b>
  The installer for windows is currently not adjusted. If you run the installer, it will copy the source files to "C:/Users/currUser/AppData/Local/appName" and start the electron project. 
</b>

# License
The MIT License (MIT)
Copyright © 2016 <copyright holders>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
