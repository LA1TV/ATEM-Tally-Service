var gpio = require('onoff').Gpio;
var ATEM = require('applest-atem');
var env     = require('node-env-file');
env(__dirname + '/.env');
console.log(process.env);

var atem = new ATEM();
atem.connect('192.168.72.51'); // Replace your ATEM switcher. address.

var red1 = new gpio(7, 'out');
var red2 = new gpio(8, 'out');
var red3 = new gpio(9, 'out');

var lastTallys;

atem.on('stateChanged', function(err, state) {
  if (lastTallys!=state.tallys){
    console.log("New tally info! " + state.tallys);
  }
  lastTallys = state.tallys;

  if(state.tallys[1]==1){ //Camera 1
    red1.write(1, function(err){if (err) throw err; });
  }else {
    red1.write(0, function(err){if (err) throw err; });
  }

  if(state.tallys[2]==1){ //Camera 2
    red2.write(1, function(err){if (err) throw err; });
  }else{
    red2.write(0, function(err){if (err) throw err; });
  }
  if(state.tallys[3]==1){ //Camera 3
    red3.write(1, function(err){if (err) throw err; });
  }else{
    red3.write(0, function(err){if (err) throw err; });
  }
  console.log('finished callback');
});
