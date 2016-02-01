var gpio = require('onoff').Gpio;
var ATEM = require('applest-atem');
var env = require('node-env-file');
var events = require('events');
env(__dirname + '/.env');

var cameraIDs = process.env.CAMIDS.split(',');
var cameraPins = process.env.CAMPINS.split(',');

var atem = new ATEM();
atem.connect(process.env.ATEMIP);

var atemWatcher = new events.EventEmitter();
var lastTallys = [];
atem.on('stateChanged', function(err, state){
  if (lastTallys != state.tallys && state.tallys.length>1) {
    atemWatcher.emit('stateChanged');
    lastTallys = state.tallys;
  }
});

function light(cameraID, programPin, friendlyName) {
  console.log(friendlyName + ' created as new light on pin ' + programPin + '.');
  this.cameraID = cameraID;
  this.programPin = programPin;
  this.friendlyName = friendlyName;
  this.led = new gpio(this.programPin, 'out');
  var that = this;
  this.init = function(atem) {
    atemWatcher.on('stateChanged', function(err) {
      that.led.write(+(atem.state.tallys[that.cameraID] == 1), function(err) {
        if (err) throw err;
      });
    });
  };
}
atem.on('connect',function(){
var leds = [];
setTimeout(function(){
for (var i in cameraIDs){
  leds[i]=new light(cameraIDs[i], cameraPins[i], atem.state.channels[+i+1].name);
  leds[i].init(atem);
}
}, 500);
});
