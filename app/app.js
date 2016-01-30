var gpio = require('onoff').Gpio;
var ATEM = require('applest-atem');

var atem = new ATEM();
atem.connect('192.168.72.51'); // Replace your ATEM switcher. address.

var red1 = new gpio(7, 'out');
var red2 = new gpio(8, 'out');
var red3 = new gpio(9, 'out');

atem.on('stateChanged', function(err, state) {
  console.log(state.tally); // catch the ATEM tally state.

  if(state.tally[1]>=2){ //Camera 1
    red1.writeSync(1);
  }else {
    red1.writeSync(0);
  }

  if(state.tally[2]>=2){ //Camera 2
    red2.writeSync(1);
  }else{
    red2.writeSync(0);
  }
  if(state.tally[3]>=2){ //Camera 3
    red3.writeSync(1);
  }else{
    red3.writeSync(0);
}
}
