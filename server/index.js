const express = require('express');
const http = require('http');
const socketio = require("socket.io")
const ucon = require('./src/ucon').server("0.0.0.0", 1000)
const Split = require("stream-split")
const dgram = require('dgram');

const app = express()
const server = http.createServer(app)
const udp = dgram.createSocket('udp4');
const io = socketio(server, {
    cors: {
        origin: '*',
    }
})

var currentControls = {}
var currentConfig = {}
const port = 80
const port_udp = 2000

var carStatus = {
    connected: false,
    active: false
}

const NALSeparator = new Buffer.from([0, 0, 0, 1])
const NALSplitter = new Split(NALSeparator)

app.use(express.json())
app.use(express.static("./client-h264"))

ucon.on("frame", data => {
    io.sockets.emit("frame", data)
})

ucon.on("telemetry", data => {
    io.sockets.emit("telemetry", data)
})

udp.on("message", (data, info) => {
    NALSplitter.write(data)
})

NALSplitter.on('data', (data) => {
    io.sockets.emit("video", data)
})

io.on("connect", client => {
    let clientIP = client.handshake.address.split("::ffff:")[1]
    if (!clientIP) {
        clientIP = "local"
    }
    console.log(`[io] New client connected: ${clientIP}`);

    //shell
    client.on("shell-in", data => {
        io.sockets.emit("shell-in", data)
    })

    client.on("shell-out", data => {
        io.sockets.emit("shell-out", data)
    })

    client.on("shell-resize", data => {
        io.sockets.emit("shell-resize", data)
    })

    //standby service
    client.on("car-status", status => {
        io.sockets.emit("car-status", status)
        carStatus = status
    })

    client.on("car-status-request", () => {
        io.sockets.emit("car-status-request")
    })

    client.on("car-start", () => {
        io.sockets.emit("car-start")
    })

    //car config
    client.on("car-conf", data => {
        if (JSON.stringify(currentConfig) != JSON.stringify(data)) {
            ucon.broadcast("car-conf", data)
            currentConfig = data
        }
    })

    //car control
    client.on("car-control", data => {
        if (JSON.stringify(currentControls) != JSON.stringify(data)) {
            ucon.broadcast("car-control", data)
            currentControls = data
        }
    })
})

server.listen(port, () => {
    console.log("[HTTP] Online on port " + port);
})

udp.on('listening', () => {
    const address = udp.address();
    console.log(`Raw UDP server listening on ${address.port}`);
});

udp.bind(port_udp)
