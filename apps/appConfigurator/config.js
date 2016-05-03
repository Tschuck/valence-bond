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
    y               : "100% - 160px",
    width           : 'auto',
    height          : 'auto',

    "overlayScrollbars" : false,
    resizable            : false,

    transparent     : true,
    frame           : false,
  }
};