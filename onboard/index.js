const config = require("./data/config.json")
const stream = require("./src/stream")
const ucon = require("./src/ucon")
const control = require("./src/control")
const telemetry = require("./src/telemetry")

const udpClient = ucon.client(config.host, config.port_udp)

function init() {
    stream.init(udpClient, config)
    control.init(udpClient, config)
    telemetry.init(udpClient, config)
}

init()