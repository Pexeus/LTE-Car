const config = require("../data/config.json")
const stream = require("./stream")
const udplusModule = require("udplus")
const control = require("./control")
const telemetry = require("./telemetry")

const udplusClient = udplusModule.createClient()

function init() {
    udplusClient.connect(config.host, config.port_udp, info => {
        console.log(`UDP Connection Ready: ${info}`);

        stream.init(udplusClient, config)
        control.init(udplusClient, config)
        telemetry.init(udplusClient, config)
    })
}

init()