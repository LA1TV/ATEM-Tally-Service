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
  if (lastTallys != state.tallys && state.tallys.length>1) {
    console.log('New tally info emitting!');
    atemWatcher.emit('stateChanged');
    lastTallys = state.tallys;
  }
});


function light(cameraID, programPin, friendlyName) {
  console.log(friendlyName + ' created as new light.');
  this.cameraID = cameraID;
  this.programPin = programPin;
  this.friendlyName = friendlyName;
  this.led = new gpio(this.programPin, 'out');
  var that = this;
  this.init = function(atem) {
    atemWatcher.on('stateChanged', function(err) {
      console.log(that.friendlyName + ' ' + atem.state.tallys[that.cameraID]);
      that.led.write(atem.state.tallys[that.cameraID] == 1, function(err) {
        if (err) throw err;
      });
    });
  };
}
var red1 = new light(0, 14, 'Camera 1');
var red2 = new light(1, 15, 'Camera 2');
var red3 = new light(2, 18, 'Camera 3');

red1.init(atem);
red2.init(atem);
red3.init(atem);
