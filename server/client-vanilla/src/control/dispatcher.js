const dispatcher = {
    lastCommand: {}
}

function dispatch(channel, data) {
    socket.emit(channel, data)
}

