var gpio = require('onoff').Gpio;

var red = new gpio(4, 'out');
//gpio.open(11, 'outut');
//gpio.open(12, 'outut');


function writeOn(pin){
  console.log("called writeOn");
  gpio.write(pin, 1, function(err) {
      if (err) throw err;
      console.log('Written on to pin');
  });
}
function writeOff(pin){
  console.log("called writeOff");
  gpio.write(pin, 0, function(err) {
      if (err) throw err;
      console.log('Written off to pin');
  });
}

var pin7=false;
setInterval(function(){
  if(pin7){
    red.write(0, function(err){if (err) throw err;});
        pin7=false
  }else{
    red.write(1, function(err){if (err) throw err;});
        pin7=true
  }
},1000);
/*setInterval(function(){
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
  ,30000)*/
