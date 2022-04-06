const cp = require("child_process")
const kill  = require('tree-kill');

module.exports = {
    initiate: host => {
        init(host)
    }
}

var carStatus

function init(socket) {
    var noca
    carStatus = {
        connected: true,
        active: false
    }

    socket.emit("car-status", carStatus)

    socket.on("car-status-request", () => {
        socket.emit("car-status", carStatus)
    })

    socket.on("car-start", async () => {
        if (noca != undefined) {
            kill(noca.pid)
            carStatus = {
                connected: true,
                active: false
            }

            noca = undefined
        }
        else {
            noca = spawner("node ../index.js")
            carStatus = {
                connected: true,
                active: true
            }
        }

        socket.emit("car-status", carStatus)
    })
}

function spawner(command) {
    const process = cp.spawn(command, [], { shell: true })

    process.stdout.on('data', (data) => {
        console.log(`[noca]: ${String(data).replace(/\n/g, '')}`);
    });
      
    process.stderr.on('data', (data) => {
        console.error(`[noca Error]: ${data}`);
    });

    return process
}

function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve()
        }, ms);
    })
}