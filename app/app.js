var Gpio = require('onoff').Gpio;
var ATEM = require('applest-atem');
var events = require('events');
var config = require('./config.json');
var lights = require('./lights.json');

var atem = new ATEM();
atem.connect(config.atemIP);

var atemWatcher = new events.EventEmitter();
var lastTallys = [];
atem.on('stateChanged', function(err, state) {
  if (lastTallys !== state.tallys && state.tallys.length > 1) {
    atemWatcher.emit('stateChanged');
    lastTallys = state.tallys;
  }
});

function Light(inputId, pin, preview, invert, friendlyName) {
  console.log(friendlyName + ' created as new light on pin ' + pin + '.');
  this.cameraID = inputId;
  this.pin = pin;
  this.friendlyName = friendlyName;
  this.invert = invert;
  this.led = new Gpio(this.pin, 'out');
  var that = this;
  this.init = function(atem) {
    that.initialised = true;
    atemWatcher.on('stateChanged', function(err) {
      if (err) {
        throw err;
      }
      var state = preview ? atem.state.tallys[that.cameraID] === 2 || atem.state.tallys[that.cameraID] === 3 : atem.state.tallys[that.cameraID] === 1 || atem.state.tallys[that.cameraID] === 3;
      if (invert) {
        state = !state;
      }
      that.led.write(state ? 1 : 0, function(err) {
        if (err) {
          throw err;
        }
      });
    });
  };
}

var leds = [];

atem.once('connect', function() {
  setTimeout(function() {
    for (var i in lights) {
      if (leds === []) {
        leds[i] = new Light(lights[i].inputId, lights[i].pin, lights[i].preview, lights[i].invert, lights[i].name);
        leds[i].init(atem);
      }
    }
  }, 500);
});


function exit() {
  for (var i in leds) {
    if (leds[i].initialised) {
      leds[i].led.unexport();
    }
  }
  process.exit();
}
process.on('SIGINT', exit);
