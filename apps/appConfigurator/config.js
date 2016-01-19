var path = require('path');

module.exports = {
  id      : 'appConfigurator',
  name    : 'App Configurator',
  icon    : '../../public/icon/valence.png',
  devMode : false,
  order   : 1,

  window : {
    type            : 'splash',
    "always-on-top" : true,
    "skip-taskbar"  : true,
    
    x               : "center",
    y               : "100% - 140px",
    width           : 0,
    height          : 0,

    "overlay-scrollbars" : false,
    "always-on-top"      : true, 
    resizable            : false,

    transparent     : true,
    frame           : false,
  }
};