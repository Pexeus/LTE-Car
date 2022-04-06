const socket = io()
const display = vie.get('#display')

function init() {
    initiateTerminal("terminal")
    initateStream()

    socket.on('telemetry', data => {
        updateOverlay("signal", data.connection.signalSimple + "/5")

        if (data.connection.signalSimple < 3) {
            displayAlert("Bad cellular signal: " + data.connection.signalSimple + "/5")
        }
        else {
            displayAlert("")
        }
    })

    socket.on("car-status", status => {
        updateCarStatus(status)
    })

    socket.emit("car-status-request")
}

async function updateCarStatus(status) {
    const statusDisplay = vie.get("#car_status")
    const button = vie.get("#car_start")
    button.innerHTML = "Start"

    if (status.connected == true) {
        statusDisplay.innerHTML = "Status: Connected"
        statusDisplay.classList.add("green")
    }
    if (status.active == true) {
        statusDisplay.innerHTML = "Status: Running"
        statusDisplay.classList.add("green")
        button.innerHTML = "Stop"
    }
}

function startCar() {
    socket.emit("car-start")
}

function displayAlert(text) {
    if (text != "") {
        vie.get("#alert").innerHTML = `WARNING: ${text}`
    }
    else {
        vie.get("#alert").innerHTML = ""
    }
}

function updateOverlay(key, val) {
    const target = vie.get("#stat_" + key)
    target.innerHTML = `${key}: ${val}`
}

init()