
# LTE Controlled RC Car

## Explanation Video
[![Watch the video](https://img.youtube.com/vi/yeqj-nWPKeI/maxresdefault.jpg)](https://www.youtube.com/watch?v=yeqj-nWPKeI)

## Requirements
 ### Hardware
 - RC Car width standard components
 - Any Raspberry Pi
 - Raspberry Pi Compatiple Camera
 - Onboard Power for the Raspberry Pi (Powerbank/Converter)
 - USB LTE Modem

### Software (Raspberry Pi)
- Nodejs (Tested on v14) [Download](https://nodejs.org/en/)
- Socat `sudo apt-get install socat`
- Pigpio `sudo apt-get install pigpio`

### Software (Server)
- Nodejs (Tested on v15) [Download](https://nodejs.org/en/)

## Codebase
- onboard: Code running on your RC Car
- server: Code running on your server

### Startup server
1. `cd server`
2. `npm i`
3. `node index.js`

### Startup onboard
1. `cd onboard`
2. `npm i`
3. `node index.js`

### Startup standby service
1. `cd onboard/standby`
2. `node index.js`
    

