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
var lastTallys = [0,0,0,0,0,0,0,0,0,0,0,0,0,0];
atem.on('stateChanged', function(err, state){
  if (lastTallys != state.tallys && state.tallys.length>1) {
    console.log('New tally info emitting! ' + state.tallys);
    atemWatcher.emit('stateChanged', state);
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
    atemWatcher.on('stateChanged', function(err, state) {
      console.log('incoming tallys as  ' + state.tallys);
      that.led.write(tallys[that.cameraID] == 1, function(err) {
        if (err) throw err;
      });
    });
  };
}
var red1 = new light(0, 14, 'Camera 1');
red1.init(atem);
