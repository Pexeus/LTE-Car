const axios = require("axios")
const parser = require("xml-js")

var lastUpdate

module.exports = {
    init: (socket, config) => {
        init(socket, config)
    }
}

function timer(ms) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve()
        }, ms);
    })
}

async function init(socket, config) {
    console.log("Initiating telemetry");
    updateTelemetry(socket)
}

async function updateTelemetry(socket) {
    const telemetry = {}

    telemetry.connection = await signalStatus()
    
    dispatch(telemetry, socket)

    await timer(1000)
    updateTelemetry(socket)
}

function dispatch(data, socket) {
    if (JSON.stringify(data) != JSON.stringify(lastUpdate)) {
        socket.send("telemetry", data)
        //lastUpdate = data
    }
}

async function signalStatus() {
    return new Promise(async resolve => {
        const host = "http://192.168.8.1"
        const statusUrl = '/api/monitoring/status'
        const trafficUrl = '/api/monitoring/traffic-statistics'

        const status = await fetch(host + statusUrl)
        const traffic = await fetch(host + trafficUrl)

        const connection = {
            signalSimple: Number(status.SignalIcon._text),
            currentUpload: Number(traffic.CurrentUpload._text),
            currentDownload: Number(traffic.CurrentDownload._text)
        }

        resolve(connection)
    })
}

function fetch(url) {
    const headers = {
        "Accept": "*/*",
        "Accept-Language": "en-US,en;q=0.5",
        "_ResponseSource": "Broswer",
        "Update-Cookie": "UpdateCookie",
        "X-Requested-With": "XMLHttpRequest"
    }

    return new Promise(async resolve => {
        const response = await axios.get(url, {headers: headers, credentials: "include"})
            .catch(err => {
                console.log("Cant contact LTE Antenna");
                resolve(false)
            })

        if (response) {
            const json = parser.xml2js(response.data, {
                compact: true,
                spaces: 4
            })

            resolve(json.response)
        }
    })
}