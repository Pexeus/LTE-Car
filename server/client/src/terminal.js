const terminal = new Terminal()
const fitAddon = new FitAddon.FitAddon()

function initiateTerminal(id) {
    const terminalContainer = document.getElementById(id)

    terminal.loadAddon(fitAddon);
    terminal.open(terminalContainer)

    fitAddon.fit()

    terminal.onData(key => {
        socket.emit("shell-in", key)
    });

    socket.on("shell-out", data => {
        terminal.write(data)
    })

    const observer = new ResizeObserver(() => {
        fitAddon.fit()
        socket.emit("shell-resize", {cols: terminal.cols, rows: terminal.rows})
    })

    observer.observe(terminalContainer)

    socket.emit("shell-resize", {cols: 3, rows: 3})
    socket.emit("shell-resize", {cols: terminal.cols, rows: terminal.rows})
}

function toggleTerminal() {
    const terminalContainer = document.getElementById("terminalWrapper")

    if (terminalContainer.classList.length == 1) {
        terminalContainer.classList.add("terminalHidden")
        setTimeout(() => {
            terminalContainer.style.visibility = "hidden"
        }, 200);
    }
    else {
        terminalContainer.style.visibility = "visible"
        terminalContainer.classList.remove("terminalHidden")
    }
}