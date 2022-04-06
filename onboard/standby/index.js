const config = require("../data/config.json")
const shell = require("./shell")
const runner = require("./runner")
const io = require("socket.io-client")

function init(host) {
    const socket = io(`http://${host}/`)
    console.log(`standby service ready [${host}]`);

    shell.initiate(socket)
    runner.initiate(socket)
}

init(config.host_standby)