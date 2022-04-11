const express = require('express');
const http = require('http');
const socketio = require("socket.io")
const udplusMoodule = require("udplus")
const Split = require("stream-split")

udplusMoodule.logging(false)
udplus = udplusMoodule.createServer()

const app = express()
const server = http.createServer(app)
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


udplus.on("telemetry", data => {
    io.sockets.emit("telemetry", data)
})

udplus.on("raw", (data, info) => {
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
            udplus.emit("car-conf", data)
            currentConfig = data
        }
    })

    //car control
    client.on("car-control", data => {
        if (JSON.stringify(currentControls) != JSON.stringify(data)) {
            udplus.emit("car-control", data)
            currentControls = data
        }
    })
})

server.listen(port, () => {
    console.log("[HTTP] Online on port " + port);
})

udplus.listen(3000, info => {
    console.log("[udplus] Online on " + info);
})
