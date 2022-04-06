const socket = io()
const display = vie.get('#display')

function init() {
    initateStream()
    initiateTerminal("terminal")

    socket.on('telemetry', data => {
        console.log(data);
        updateOverlay("signal", data.connection.signalSimple + "/5")
    })
}

function updateOverlay(key, val) {
    const target = vie.get("#stat_" + key)
    target.innerHTML = `${key}: ${val}`
}

init()