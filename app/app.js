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

atem.on('stateChanged', function(err, state) {
  console.log(state.tallys); // catch the ATEM tally state.

  if(state.tallys[1]>=2){ //Camera 1
    red1.writeSync(1);
  }else {
    red1.writeSync(0);
  }

  if(state.tallys[2]>=2){ //Camera 2
    red2.writeSync(1);
  }else{
    red2.writeSync(0);
  }
  if(state.tallys[3]>=2){ //Camera 3
    red3.writeSync(1);
  }else{
    red3.writeSync(0);
  }
  console.log('finished callback');
});
