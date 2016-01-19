define([], function() {
  return function(basePath) {
    return {
      waitSeconds: 200,
      map: {
        '*': {
          'css'      : 'require-css'
        }
      },
      paths: {
        'require-css'   : basePath + '/libs/requireCSS',
        'angular'       : basePath + '/libs/angular.min',
        'awesomeSlider' : basePath + '/libs/angular-awesome-slider.min',
        'ngAnimate'     : basePath + '/libs/angular-animate.min',
        'jquery'        : basePath + '/libs/jquery.min',
        'ngLoader'      : basePath + '/ngLoader'
      },
      shim: {
        'angular': {
          exports: 'angular'
        },
        'angularResource': {
          deps: ['angular']
        },
        'ngAnimate': {
          exports: 'ngAnimate',
          deps: ['angular']
        }
      }
    }
  }
});
