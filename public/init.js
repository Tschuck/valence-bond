var ipc      = require("electron").ipcRenderer;
var config   = require(__dirname + '/config.js');

/* loades normal web requireJS and map the node require js to nodeRequire */
var loadRequire = function(basePath, callback) {
  window.nodeRequire = window.require;
  delete window.require;

  var requireInclude = document.createElement('script');
  requireInclude.setAttribute('src', basePath + '/libs/require.js');
  document.head.appendChild(requireInclude);

  /* wait while require is loading */
  waitForScriptLoaded('require', function() {
    require([ basePath + '/requireJS.js' ], function(requireConfig) {
      require.config(requireConfig(basePath));

      if (config.web && config.web.require) {
        require.config(config.web.require);
      }

      callback();
    });
  });
};

//get the url to the public folder
//select the latest src element (the init.js include) and retrieve the url
var getBasePath = function() {
  var scripts  = document.querySelectorAll('script');
  var basePath = scripts[scripts.length - 1].src;
  basePath     = basePath.replace('/init.js', '');

  return basePath;
};

/* wait until a object name was written to the window */
var waitForScriptLoaded = function(name, callback) {
  if (window[name]) {
    callback();
  } else {
    setTimeout(function() {
      waitForScriptLoaded(name, callback);
    }, 50);
  }
};

var bindResizeEvent = function($) {
  /* bind resize event handler */
  addResizeEvent($('body'), sendResizeEvent);
}

var addResizeEvent = function($el, callback) {
  var checkResize = function() {
    var lastHeight = $el.outerHeight();
    var lastWidth  = $el.outerWidth();
    setTimeout(function() {
      if (($el.outerHeight() != lastHeight) || ($el.outerWidth() != lastWidth)) {
        callback($el.outerWidth(), $el.outerHeight());
      }
      checkResize();
    }, 100);
  } 
  checkResize(); 
}

var sendResizeEvent = function(width, height) {
  ipc.send('window_resize', {
    id     : config.id,
    width  : width,
    height : height
  });
}

/* load require, angular and all meeWindows components*/
var basePath = getBasePath();
loadRequire(basePath, function() {
  //basic libs to load
  var dependencies = [ 
    'jquery', 
    'angular', 
    'ngLoader', 
    'css!' + basePath + '/css/ng-animation.css' ,
    'css!' + basePath + '/css/animate.css',
    'css!' + basePath + '/images/style.css'
  ];

  //add additional files from application
  if (config.web && config.web.requireDependencies) {
    dependencies = dependencies.concat(config.web.requireDependencies);
  }

  require(dependencies, function($, ng, ngLoader, ngAnimate) {
    bindResizeEvent($);

    //custom angular dependencies
    var ngDependencies = (config.web && config.web.angularDependencies) ? config.web.angularDependencies : [ ];
    var ngApp          = angular.module( 'valence', ngDependencies);
    ngLoader(__dirname + '/controller', ngApp, function() {
      ngLoader(__dirname + '/../../public/dataService.js', ngApp, function() {
        ngLoader(__dirname + '/directives', ngApp, function() {
          ng.bootstrap(document, ['valence']);
          ipc.send('finished_window_loading', config.id);
        });        
      })
    });
  });
});