var gpio = require('rpi-gpio');

gpio.setup(7, gpio.DIR_OUT);
gpio.setup(11, gpio.DIR_OUT);
gpio.setup(12, gpio.DIR_OUT);



function closePins() {
    gpio.destroy(function() {
        console.log('All pins unexported');
    });
}

function writeOn(pin){
  gpio.write(pin, true, function(err) {
      if (err) throw err;
      console.log('Written on to pin '+pin);
  });
}
function writeOff(pin){
  gpio.write(pin, false, function(err) {
      if (err) throw err;
      console.log('Written off to pin '+pin);
  });
}


writeOn(7);
setInterval(function(){
  writeOff(7);
  writeOn(11);
  setTimeout(function(){
    writeOff(11);
    writeOn(12);
    setTimeout(function(){
      writeOff(12)
      writeOn(7)
    },10000)
  }, 10000)}
  ,30000)
