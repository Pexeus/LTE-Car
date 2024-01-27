const config = require("./data/config.json")

const standby = require("./standby/index.js")

function init() {
    standby.init(config.host, config.port_http)
}

init()