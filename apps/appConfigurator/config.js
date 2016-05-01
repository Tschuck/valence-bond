var path = require('path');

module.exports = {
  id      : 'appConfigurator',
  name    : 'App Configurator',
  icon    : '../../public/icon/valence.png',
  devMode : false,
  order   : 1,

  window : {
    type            : 'splash',
    "alwaysOnTop" : true,
    "skipTaskbar"  : true,
    
    x               : "center",
    y               : "100% - 140px",
    width           : 0,
    height          : 0,

    "overlayScrollbars" : false,
    resizable            : false,

    transparent     : true,
    frame           : false,
  }
};