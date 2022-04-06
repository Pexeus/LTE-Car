const gpControls = {
    axes: {},
    paddles: {},
    buttons: {}
}

const gpConf = {
    buttons: {

    }
}


window.addEventListener("gamepadconnected", function(e) {
    console.log("Gamepad connected")
    updateControls();
})

async function updateControls() {
    const gamepad = navigator.getGamepads()[0];

    if (gamepad != undefined) {

        gpConf.buttons.padUp = gamepad.buttons[12].value
        gpConf.buttons.padDown = gamepad.buttons[13].value
        gpConf.buttons.padLeft = gamepad.buttons[14].value
        gpConf.buttons.padRight = gamepad.buttons[15].value

        //setting axes
        gamepad.axes.forEach((value, index) => {
            gpControls.axes[index] = exponentiate(value)
        });

        //setting paddles
        gpControls.paddles.left = Number(gamepad.buttons[6].value.toFixed(3))
        gpControls.paddles.right = Number(gamepad.buttons[7].value.toFixed(3))
        gpControls.buttons.L1 = gamepad.buttons[4].value
        gpControls.buttons.R1 = gamepad.buttons[5].value
        gpControls.buttons.square = gamepad.buttons[2].value

        setTimeout(() => {
            updateControls();
        }, 100);


        dispatch('car-control', gpControls)
        dispatch('car-conf', gpConf)
    }
}

function exponentiate(axe) {
    if (axe > 0.1 || axe < -0.1) {
        if (axe < 0) {
            return Number(((axe * axe) * -1).toFixed(3))
        }
        else {
            return Number((axe * axe).toFixed(3))
        }
    }
    else {
        return 0
    }
}