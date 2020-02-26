// Start socket connection (frontend)
var socket = io.connect("http://localhost:8080")

// Store user type
var type = "screen"

// Recieve data from server
socket.on('position', (data) => {
    console.log("Recieved position from " + data.id + ": ", data.position)
})