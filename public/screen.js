// Require libraries
// var d3 = require('d3');

// Start socket connection (frontend)
var socket = io.connect("http://localhost:8080")

// Store user type
var type = "screen"

// Send over socket
// When page first loads, send type
window.addEventListener('load', function () {
    // send type to the server
    socket.emit('sendType', {
        id: socket.id,
        type: type
    })
})

// Recieve over socket
// recieve position from particpant
socket.on('position', (data) => {
    // when you recieve an answer from the server, change the title to that answer
    // console.log("Recieved position from " + data.id + ": ", data.position)
    document.getElementById('positionTitle').innerHTML = data.position;
})

// Recieve new question from facilitator
socket.on('sendQuestion', (data) => {
    console.log("recieved a new question from the facilitator: " + data.question)
})

