// Start socket connection (frontend)
var socket = io.connect()

// Store user type
var type = "facilitator"

// Send over socket
// When page first loads, send type
window.addEventListener('load', function () {
    // send type to the server
    socket.emit('sendType', {
        id: socket.id,
        type: type
    })
})

// Send question to participants and screen
// get access to button 
var sendButton = document.getElementById('sendButton')
// when button is pressed
sendButton.addEventListener('click', function () {
    // access question title
    var questionTitle = document.getElementById('questionTitle')
    if(questionTitle.innerHTML !== "Facilitator Page"){
        // send question to the server
        socket.emit('sendQuestion', {
            id: socket.id,
            question: questionTitle.innerHTML
        })
    }
})



// Recieve over socket
socket.on('newQuestion', (data) => {
    // when you recieve a  question from the server, change the title to that question 
    document.getElementById('questionTitle').innerHTML = "Recieved a question: " + data.question;
})