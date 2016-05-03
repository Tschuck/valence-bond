module.exports = {
  id      : 'appContainer',
  name    : 'App Container',
  icon    : '../../public/icon/valence.png',
  devMode : false,
  order   : 1,

  window : { 
    type            : 'splash',
    "alwaysOnTop" : true,
    "skipTaskbar"  : true,
    "overlayScrollbars" : false,
    
    x               : "center",
    y               : "100% - 80px",
    width           : 'auto',
    height          : 'auto',

    resizable       : false,
    transparent     : true,
    frame           : false,
  }  
};