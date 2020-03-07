// Require libraries and credentials
const express = require('express');
const app = express();
const socket = require('socket.io');
const mongoose = require('mongoose');
const config = require('./config');
const PORT = config.PORT;
const MONGODB_URI = config.MONGODB_URI;
// Require files
const usersRouter = require('./routes/users.js')
const tablesRouter = require('./routes/tables.js')
const submissionsRouter = require('./routes/submissions.js')
const joinRouter = require('./routes/join.js')
const prepareRouter = require('./routes/prepare.js')
const facilitateRouter = require('./routes/facilitate.js')
const presentRouter = require('./routes/present.js')


// Connect to the database
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('connected to database'))
app.use(express.json())
app.use(express.urlencoded({extended:true}));

// Setup Routing
// main route
app.use(express.static('public'));
// api routes
app.use('/user', usersRouter)
app.use('/table', tablesRouter)
app.use('/submission', submissionsRouter)
// page routes
app.use('/join', joinRouter)
app.use('/prepare', prepareRouter)
app.use('/facilitate', facilitateRouter)
app.use('/present', presentRouter)

// App server setup
const server = app.listen(PORT, function () {
//const server = app.listen(8080, function () {
    console.log("Server is running")
});

// App socket setup (backend)
var io = socket(server);
var connectedParts = []; // keep a list of the participants who are connected
var connectedPartsSockets = []; // keep a list of the participants socket ids who are connected
// When the a socket connection is made
io.on('connection', function (socket) {

    // when a client first connects
    console.log("a new client has connected, id: ", socket.id);

    // when a new participants connects, update connectedParts & connectedPartsSockets arrays
    socket.on('connectPart', (data) => {
    connectedParts.push(data)
    connectedPartsSockets.push(socket.id)
    console.log(connectedParts)
    })

    // recieve a new question submission from a participant
    socket.on('submitNewQuestion', (data) => {
        console.log("got a new question with id: ", data);
    })

    // when a client disconnects
	socket.on('disconnect', function() {
        console.log("Client has disconnected " + socket.id);

        // if the client is a participant, remove them currentParts lists
        if(connectedPartsSockets.indexOf(socket.id) !== -1){
            connectedParts.splice(connectedPartsSockets.indexOf(socket.id), 1)
            connectedPartsSockets.splice(connectedPartsSockets.indexOf(socket.id), 1)
        }
	});
})
















/// FROM ORIGINAL TESTING, SHOULD BE DELETED LATER

  // // When first connecting, check if client is the facilitator or screen and store their id
    // socket.on('sendType', (data) => {
    //     if(data.type === "facilitator"){
    //         facId = socket.id
    //     }
    //     if(data.type === "screen"){
    //         scrId = socket.id
    //     }
    // })

    // // Recieve data from client

    // // Recieve position
    // socket.on('position', (data) => {
    //     // console.log(data)
    //     // send data to just the screen
    //     io.to(scrId).emit('position', data)
    // })

    // // Recieve a new question
    // socket.on('newQuestion', (data) => {
    //     console.log("got a question from a participant: ", data)
    //     // send data to just the facilitator
    //     io.to(facId).emit('newQuestion', data)
    // })

    // // Recieve a question to send
    // socket.on('sendQuestion', (data) => {
    //     console.log("got a question to send to everyone: " + data)
    //     // send data to all other clients
    //     socket.broadcast.emit('sendQuestion', data)
    // })