const shell = require("./shell")
const runner = require("./runner")
const io = require("socket.io-client")

function init(host, port) {
    const socket = io(`http://${host}:${port}`)
    console.log(`standby service ready [${host}]`);

    shell.initiate(socket)
    runner.initiate(socket)
}

module.exports = {
    init: init
}