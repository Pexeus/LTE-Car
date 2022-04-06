const pty = require("node-pty");
const os = require("os");
const io = require("socket.io-client")

function init(socket) {
    const shellType = os.platform() === "win32" ? "powershell.exe" : "bash";

    const shell = pty.spawn(shellType, [], {
        name: "xterm-color",
        cols: 80,
        rows: 80,
        cwd: process.env.HOME,
        env: process.env
    });

    socket.on("shell-in", data => {
        shell.write(data)
    })

    socket.on("shell-resize", data => {
        shell.resize(data.cols, data.rows);
    })

    shell.on("data", data => {
        socket.emit("shell-out", data)
    })
}

module.exports = {
    initiate: socket => {
        init(socket)
    }
}