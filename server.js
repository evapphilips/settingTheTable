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
var connectedPartsId = []; // keep a list of the participants _id who are connected
var connectedPartsSockets = []; // keep a list of the participants socket ids who are connected
var connectedScrSocket = ""; // keep the socket id of the screen client
var connectedFacSocket = ""; // keep the socket id of the facilitator client

// When the a socket connection is made
io.on('connection', function (socket) {

    // when a client first connects
    console.log("a new client has connected, id: ", socket.id);

    // when a new participants connects, update connectedPartsId & connectedPartsSockets arrays
    socket.on('connectPart', (data) => {
        // update connectedParts
        connectedPartsId.push(data.id)
        connectedPartsSockets.push(socket.id)
        // send screen this participants _id if a screen is connected
        if(connectedScrSocket !== ""){
            io.to(connectedScrSocket).emit('shareConnectedPartId', data.id)
        }
    })

    // when a new screen connects, check that there is no other screen client connect and update connectedScrSocket
    socket.on('connectScr', (data) => {
        if(connectedScrSocket === ""){ // if no other screen clients are connected, updated connectedScrSocket
            // send success message
            io.to(socket.id).emit('checkConnectScr', "success")
            // update connectedScrSocket
            connectedScrSocket = socket.id
            // send screen a list of the current participant _id's
            connectedPartsId.forEach((id) => {
                io.to(socket.id).emit('shareConnectedPartId', id)
            })
        }else{ // if there is already a screen client, disconnect and send alert
            // send failure message
            io.to(socket.id).emit('checkConnectScr', "failure")
        }
    })

    // when a new facilitator connects, check that there is no other facilitator connected and updated connectedFacSocket
    socket.on('connectFac', (data) => {
        if(connectedFacSocket === ""){ // if no other facilitator clients are connected, updated connectedFacSocket
            // send success message
            io.to(socket.id).emit('checkConnectFac', "success")
            // update connectedFacSocket
            connectedFacSocket = socket.id
        }else{ // if there is already a fac client, disconnect and send alert
            // send failure message
            io.to(socket.id).emit('checkConnectFac', "failure")

        }
    })

    // recieve a new question submission from a participant
    socket.on('submitNewQuestion', (data) => {
        console.log("got a new question with id: ", data);
        // if there is a facilitator, send a message to the facilitator with the new question
        if(connectedFacSocket !== ""){
            io.to(connectedFacSocket).emit('newSubmissionAdded', data)
        }
        
    })

    // recieve a question to share from facilitator
    socket.on('shareQuestion', (data) => {
        console.log("new question to share: ", data);
        // send the question id to the participants and the main screen
        socket.broadcast.emit('changeCurrentQuestion', data);
    })

    // recieved a clear to share from facilitator
    socket.on('clearQuestion', (data) => {
        console.log("clear current question")
        // send a message to clear to the participants and the main screen
        socket.broadcast.emit('clearCurrentQustion', data)
    })


    // recieve answer for the current question from a participant
    socket.on('sendCurrentAns', (data) => {
        console.log("Recieved answer " + data.currentAnswer + " from user: " + data._id)
        // if there is a screen presenting, send a message to the screen that a participants answers the question
        io.to(connectedScrSocket).emit('newAnswerShared', data)
    })


    // when a client disconnects
	socket.on('disconnect', function() {
        console.log("Client has disconnected " + socket.id);

        // if the client is a participant, remove them currentParts lists
        if(connectedPartsSockets.indexOf(socket.id) !== -1){
            // tell screen to remove
            if(connectedScrSocket !== ""){
                io.to(connectedScrSocket).emit('shareDisconnectedPartId', connectedPartsId[connectedPartsSockets.indexOf(socket.id)])
            }
            // remove
            connectedPartsId.splice(connectedPartsSockets.indexOf(socket.id), 1)
            connectedPartsSockets.splice(connectedPartsSockets.indexOf(socket.id), 1)
            
        }

        // if the client is a screen, remove them from them connectedScr list
        if(socket.id === connectedScrSocket){
            connectedScrSocket = ""
        }

        // if the client is a facilitator, remove them from them connectedFac list
        if(socket.id === connectedFacSocket){
            connectedFacSocket = ""
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