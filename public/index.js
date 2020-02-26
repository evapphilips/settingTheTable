// Start socket connection (frontend)
var socket = io.connect("http://localhost:8080")

// Store user type
var type = "participant"

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

// // Recieve data from server
// socket.on('position', (data) => {
//     console.log("Recieved position from " + data.id + ": ", data.position)
// })

