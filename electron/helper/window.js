var BrowserWindow = require('browser-window');
var screen        = require('screen');
var valence       = require(__dirname + '/../valence.js');

var Window = function(api, config) {
  this.api      = api;
  this.config   = config;
  if ((this.config.id === 'appConfigurator') || (this.config.id === 'appContainer')) {
    this.window = createWindow.call(this); 
  }
};

var createWindow = function() {
  this.api.log.info('newWindow');
  this.api.app.loading(true);

  var win = new BrowserWindow(this.config.window); 
  win.loadUrl('file://' + this.config.path + '/index.html');

  if (this.config.devMode) {
    win.openDevTools({
      detach : true
    });
  }

  if (!this.isVisible()) {
    this.hide();
  }

  win.on('closed', this.close.bind(this));

  return win;
};

Window.prototype.isVisible = function() {
  return valence.status[this.config.id].valence && valence.status[this.config.id].shown && valence.status[this.config.id].active;
};

Window.prototype.close = function() {
  this.api.app.on.close();
  delete this.window;
};

Window.prototype.resize = function(event, obj) {
  this.api.log.info('resize window');
  //dont resize the current window when it's not shown on the screen (nothing will happens)
  //save the resize object and check on the next show event, if a resize was needed
  if (this.isVisible()) {
    this.window.setSize(obj.width, obj.height);
    this.position();
  } else {
    this.savedResize = obj;
  }
}

Window.prototype.position = function() {
  var winSize     = this.window.getContentSize();
  var winPosition = this.window.getPosition();
  var screenSize  = screen.getPrimaryDisplay().workAreaSize;

  /* set left and top position to 
      1. config.top value
      2. config.x value
      3. current window position
  */
  var left = this.config.window.left ? this.config.window.left : (this.config.window.x ? this.config.window.x : winPosition[0]);
  var top  = this.config.window.top  ? this.config.window.top  : (this.config.window.y ? this.config.window.y : winPosition[1]);
  /* check if left contains percentage character and calculate the position if its available */
  if ((typeof left === "string") && (!!~left.indexOf('%') || !!~left.indexOf('px') || (left === "center"))) {
    /* get screen size */
    left = getPercPosition(left, screenSize.width, winSize[0]);
  }

  /* check if top contains percentage character and calculate the position if its available */
  if ((typeof top === "string") && (!!~top.indexOf('%') || !!~top.indexOf('px') || (top === "center"))) {
    /* get screen size */
    top = getPercPosition(top, screenSize.height, winSize[1]);
  }
  
  top  = Math.round(top);
  left = Math.round(left);
  this.window.setPosition(left, top);
}

Window.prototype.show = function() {
  //TODO: implement window loading only when needed
  this.api.log.info('show window');
  if (!this.window) {
    this.window = createWindow.call(this); 
  }
  this.window.restore();

  if (this.savedResize) {
    this.resize({ }, { width : this.savedResize.width, height : this.savedResize.height });
  }
};

Window.prototype.hide = function() {
  this.api.log.info('hide window');
  if (this.window) {
    this.window.minimize();
  }
};

Window.prototype.toggle = function() {
  this.api.log.info('Toggle window func');
  if (this.isVisible()) {
    this.show();
  } else {
    this.hide();
  }
}

var getPositionFromArithmetic = function(screenSize, pos) {
  var splittedPos = ['+'].concat(pos.split(/ /g));
  var absolutePos = 0;
  for (var i = 0; i < splittedPos.length; i++) {
    var operator = splittedPos[i];
    var pixels   = splittedPos[i + 1];
    var position;

    if (!!~pixels.indexOf('%')) {
      pixels = pixels.replace('%');
      position = (screenSize / 100) * parseInt(pixels);      
    } else if (!!~pixels.indexOf('px')) {
      pixels = pixels.replace('px');
      position = parseInt(pixels);
    } else if (!isNaN(pixels)) {
      position = parseInt(pixels);
    }

    if (operator === '-' || operator === '+') {
      i++
    }

    if (position) {
      if (operator === '-') {
        position = position * -1;
      }
      absolutePos += position;
    }
  }
  return absolutePos;
};

/* get position relative to the screen or fully center */
var getPercPosition = function(pos, screenSize, windowSize) {
  var center = (pos === "center") ? (windowSize / 2) : windowSize;
  pos        = pos.replace('center', '50%');

  pos = getPositionFromArithmetic(screenSize, pos) - center;
  return Math.round(pos);
}

module.exports = Window;