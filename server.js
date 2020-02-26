// Require libraries
var express = require('express');
var socket = require('socket.io');


// App setup
var app = express();
var server = app.listen(8080, function () {
    console.log("Listening to requrest on port 8080")
});

// Static files setup
app.use(express.static('public'));

// Socket setup (backend)
var io = socket(server);
// When the a socket connection is made
io.on('connection', function (socket) {
    console.log("a new user has connected, id: ", socket.id);

    // Recieve data from client
    // Recieve position
    socket.on('position', (data) => {
        console.log(data)
        // send data to all other clients
        socket.broadcast.emit('position', data)
    })
})