var gpio = require('onoff').Gpio;
var ATEM = require('applest-atem');
var env = require('node-env-file');
env(__dirname + '/.env');

var cameraID = process.env.cameraID.split(',');
var cameraPins = process.env.cameraPins.split(',');

console.log(process.env);

var atem = new ATEM();
atem.connect('192.168.72.51'); // Replace your ATEM switcher. address.

function light(cameraID, programPin, friendlyName) {
  this.cameraID = cameraID;
  this.programPin = programPin;
  this.friendlyName = friendlyName;
  that = this;
  this.led = new gpio(this.programPin, 'out');
  this.init = function(atem) {
    atem.on('stateChanged', function(err, state) {
      if (state.tallys[that.cameraID] == 1) {
        that.led.write(1, function(err) {
          if (err) throw err;
        });
      } else {
        that.led.write(0, function(err) {
          if (err) throw err;
        });
      }
    });
  };
}
var red1 = new light(0, 4, 'Camera 1');
red1.init(atem);
