const config = require("./data/config.json")
const stream = require("./src/stream")
const udplusModule = require("udplus")
const control = require("./src/control")
const telemetry = require("./src/telemetry")

const udplusClient = udplusModule.createClient()

function init() {
    udplusClient.connect(config.host, config.port_udp, info => {
        console.log(`UDP Connection Ready: ${info}`);

        stream.init(udpClient, config)
        control.init(udpClient, config)
        telemetry.init(udpClient, config)
    })
}

init()