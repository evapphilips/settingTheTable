// Require libraries and files
require('dotenv').config()
const express = require('express');
const app = express();
const socket = require('socket.io');
const mongoose = require('mongoose')

const usersRouter = require('./routes/users.js')


// Connect to the database
//mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
mongoose.connect(process.env.MONGODB_URI || process.env.DATABASE_URL, { useNewUrlParser: true });
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('connected to database'))
app.use(express.json())


// Setup Routing
app.use(express.static('public'));
app.use('/user', usersRouter)


// App setup
const server = app.listen(8080, function () {
    console.log("Listening to requrest on port 8080")
});


// Socket setup (backend)
var io = socket(server);
var facId = "";
var scrId = "";
// When the a socket connection is made
io.on('connection', function (socket) {
    console.log("a new user has connected, id: ", socket.id);

    // When first connecting, check if client is the facilitator or screen and store their id
    socket.on('sendType', (data) => {
        if(data.type === "facilitator"){
            facId = socket.id
        }
        if(data.type === "screen"){
            scrId = socket.id
        }
    })

    // Recieve data from client

    // Recieve position
    socket.on('position', (data) => {
        // console.log(data)
        // send data to just the screen
        io.to(scrId).emit('position', data)
    })

    // Recieve a new question
    socket.on('newQuestion', (data) => {
        console.log("got a question from a participant: ", data)
        // send data to just the facilitator
        io.to(facId).emit('newQuestion', data)
    })

    // Recieve a question to send
    socket.on('sendQuestion', (data) => {
        console.log("got a question to send to everyone: " + data)
        // send data to all other clients
        socket.broadcast.emit('sendQuestion', data)
    })
})