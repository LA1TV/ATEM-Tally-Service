var gpio = require('onoff').Gpio;
var ATEM = require('applest-atem');
var env = require('node-env-file');
var events = require('events');
env(__dirname + '/.env');

var cameraID = process.env.CAMIDS.split(',');
var cameraPins = process.env.CAMPINS.split(',');

//console.log(process.env);

var atem = new ATEM();
atem.connect(process.env.ATEMIP);

var atemWatcher = new events.EventEmitter();
var lastTallys = [];
atem.on('stateChanged', function(err, state){
  if (lastTallys != state.tallys) {
    atemWatcher.emit('stateChanged', state.tallys);
    console.log('New tally info emitted');
    lastTallys = state.tallys;
  }
});


function light(cameraID, programPin, friendlyName) {
  console.log(friendlyName + ' created as new light.');
  this.cameraID = cameraID;
  this.programPin = programPin;
  this.friendlyName = friendlyName;
  this.led = new gpio(this.programPin, 'out');
  this.init = function(atem) {
    atemWatcher.on('stateChanged', function(err, state) {
      this.led.write(state.tallys[this.cameraID] == 1, function(err) {
        if (err) throw err;
      });
    });
  }.bind(this);
}
var red1 = new light(0, 14, 'Camera 1');
red1.init(atem);
