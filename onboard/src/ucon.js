const udp = require('dgram');
const eventEmitter = require('events');

module.exports = {
    server: (interface, port) => {
        return createServer(interface, port)
    },
    client: (address, port) => {
        return createClient(address, port)
    }
}

function createServer(interface, port) {
    const server = udp.createSocket('udp4');
    const events = new eventEmitter()

    const clients = []

    server.on('error',function(error){
        console.log('ucon server errored: ' + error);
        server.close();
    });

    server.on("message", (buffer, info) => {
        const data = parse(buffer)
        console.log(data);

        if (data != undefined) {
            const isRegister = registerClient(data, info)

            if (!isRegister) {
                events.emit(data.channel, data.data)
            }
        }
    })

    server.on('listening',() => {
        var address = server.address();
        var port = address.port;
        
        console.log(`udp server online at ${interface}:${port}`);

        //initializing auto disconnect
        autoDisconnect(1500)
    });

    events.broadcast = (channel, data) => {
        for (client of clients) {
            dispatch(channel, data, client)
        }
    }

    function dispatch(channel, data, client) {
        const packet = Buffer.from(JSON.stringify({
            channel: channel,
            data: data,
        }))

        //console.log(`Sending to: ${client.address}:${client.port}`);

        server.send(packet, client.port, client.address, err => {
            if(err) {
                console.log(err);
            }
        })
    }

    function isRegistered(client) {
        for (regClient of clients) {
            if (regClient.address == client.address) {
                setLastSignal(clients.indexOf(regClient))
                setClientPort(clients.indexOf(regClient), client.port)

                return true;
            }
        }

        return false;
    }

    function setClientPort(index, port) {
        clients[index].port = port
    }

    function setLastSignal(index) {
        clients[index].lastSignal = Date.now()
    }

    function registerClient(data, client) {
        let isReg = false;

        if (data.channel == "ucon-connect") {
            if (!isRegistered(client)) {
                clients.push({
                    address: client.address,
                    port: client.port,
                    lastSignal: Date.now()
                });

                dispatch("ucon-confirm", null, client)
                console.log(`Client connected: ${client.address}:${client.port}`);
            }

            isReg = true
        }

        return isReg
    }

    function autoDisconnect(ms) {
        setInterval(() => {
            clients.forEach(client =>{
                if (Date.now() - client.lastSignal > ms) {
                    clients.splice(clients.indexOf(client), 1)
                    console.log(`Client timeout: ${client.address}:${client.port}`);
                }
            })
        }, ms);
    }

    server.bind(port, interface);

    return events
}

function createClient(address, port) {
    const client = udp.createSocket('udp4');
    const events = new eventEmitter()

    client.on("message", (buffer, info) => {
        const data = parse(buffer)

        if (data != false) {
            if (data.channel == "ucon-confirm") {
                console.log(`Connected to Server: ${info.address}:${info.port}`);
            }
            else {
                events.emit(data.channel, data.data)
            }
        }
    })

    events.send = (channel, data) => {
        dispatch(channel, data)
    }

    function dispatch(channel, data) {
        const packet = Buffer.from(JSON.stringify({
            channel: channel,
            data: data,
        }))

        //console.log(`Sending to: ${address}:${port}`);

        client.send(packet, port, address, err => {
            if(err) {
                console.log(err);
            }
        })
    }

    function keepAlive() {
        setInterval(() => {
            dispatch("ucon-connect",)
        }, 1000);
    }

    keepAlive()
    return events
}

function parse(buffer) {
    try {
        const string = String(buffer)
        const obj = JSON.parse(string)

        if (obj.channel != undefined) {
            return obj
        }

        return false
    }
    catch {
        return false
    }
}