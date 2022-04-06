const streamStats = {
    resX: 0,
    resY: 0,
    fps: 0,
    frames: 0
};

function initateStream() {
    socket.on("frame", (data)=>{
        display.src = "data:image/jpg;base64," + data
        updateOverlay("rate", data.length)

        streamStats.frames += 1
    })

    analyzeStream()
}

function analyzeStream() {
    setInterval(() => {
        streamStats.fps = streamStats.frames * 4
        streamStats.frames = 0

        updateOverlay("fps", streamStats.fps)
    }, 250);
}