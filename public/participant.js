// Start socket connection (frontend)
var socket = io.connect("http://localhost:8080")

// Store user type
var type = "participant"


// Send over socket

// When page first loads, send type
window.addEventListener('load', function () {
    // send type to the server
    socket.emit('sendType', {
        id: socket.id,
        type: type
    })
})

// Get position value and send to server
// access submit button
var submitButton = document.getElementById('submit-button')
// when submit button is clicked
submitButton.addEventListener("click", function () {
    // access the form
    var form = document.getElementById("form");

    // send position to the server
    socket.emit('position', {
        id: socket.id,
        type: type,
        position: form.elements["position"].value
    })
})

// Get question value and send to server
// access send button 
var sendButton = document.getElementById('send-button')
// when send button is clicked
sendButton.addEventListener("click", function () {
    // access input text
    var question = document.getElementById("question");

    // send question to the server
    socket.emit('newQuestion', {
        id: socket.id,
        type: type,
        question: question.value
    })
})

// Recieve over socket
// // Recieve data from server
// socket.on('position', (data) => {
//     console.log("Recieved position from " + data.id + ": ", data.position)
// })

// Recieve new question from facilitator
socket.on('sendQuestion', (data) => {
    console.log("recieved a new question from the facilitator" + data.question)
})

