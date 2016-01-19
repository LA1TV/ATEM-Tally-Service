var gpio = require('rpi-gpio');

gpio.setup(7, gpio.DIR_OUT, write);

function write() {
    gpio.write(7, true, function(err) {
        if (err) throw err;
        console.log('Written to pin 7');
    });
}


function closePins() {
    gpio.destroy(function() {
        console.log('All pins unexported');
    });
}


setTimeout(closePins, 20000);
