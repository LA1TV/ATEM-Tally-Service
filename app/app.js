var gpio = require('onoff').Gpio;
var ATEM = require('applest-atem');
var env = require('node-env-file');
env(__dirname + '/.env');

var cameraID = process.env.cameraID.split(',');
var cameraPins = process.env.cameraPins.split(',');

console.log(process.env);

var atem = new ATEM();
atem.connect(process.env.atemIP);

function light(cameraID, programPin, friendlyName) {
  this.cameraID = cameraID;
  this.programPin = programPin;
  this.friendlyName = friendlyName;
  var that = this;
  this.led = new gpio(this.programPin, 'out');
  this.init = function(atem) {
    atem.on('stateChanged', function(err, state) {
        that.led.write(state.tallys[that.cameraID] == 1, function(err) {
          if (err) throw err;
        });
    });
  };
}
var red1 = new light(0, 4, 'Camera 1');
red1.init(atem);
