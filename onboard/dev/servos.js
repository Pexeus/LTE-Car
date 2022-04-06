const gpio = require('pigpio').Gpio;

const testingConf = {
    max: 1800,
    min: 1500,
    step: 20
}

function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve()
        }, ms);
    })
}

async function testServo(pin) {
    const servo = new gpio(pin, {mode: gpio.OUTPUT})

    while(true) {
        for(i =testingConf.min; i < testingConf.max; i += testingConf.step) {
            const val = Math.round(i / 100 * 2000)
            console.log(i);
            servo.servoWrite(i)

            await sleep(500)
        }
        
        console.log("test finished");
        await sleep(1000)
    }
}

testServo(18)