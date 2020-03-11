// Variables
var type = 2; // This client is a screen (2)

// Setup socket
 // connect to the socket server
 var socket = io.connect()
 // send socket, a screen connected
 socket.emit('connectScr', {
     type: type
 })

// Recieve a failed screen connect
socket.on('checkConnectScr', (data) => {
    if(data === "success"){
        console.log("screen connected")
    }else if(data === "failure"){
        // show an failure alert
        alert("Uh oh, looks like someone else is already presenting this table, you have been disconnected")
        // disconnect this user from the socket
        socket.disconnect()
    }  
})

// access plateContainer div to put svg's into
var plateContainer = d3.select(".plateContainer")
// plateContainer.append('svg')

// Recieve an _id from a connected participant
socket.on('shareConnectedPartId', (data) => {
    // console.log("recieved a connected user id: ", data);
    // get svg src from this participant
    fetch('/user/find/' + data).then(result => result.json()).then(d => {
        // append svg to plateContainer
        plateContainer.append('img')
            // .attr('id', data)
            .attr('id', "pl" + data)
            .attr("src", d.src)
            .attr('width', 100)
            .attr('height', 100)        
    })

})

// Recieve an _id from a disconnected participant
socket.on('shareDisconnectedPartId', (data) => {
    console.log("recieve a disconnected user id: ", data);

    // remove the appropriate plate
    d3.select(".plateContainer").selectAll('#pl' + data).remove()
})

// Recieve a new current question 
socket.on('changeCurrentQuestion', (data) => {
    // get the current question details fromt he submissions db
    fetch('/submission/find/' + data).then(result => result.json()).then(d => {
        // change the current question
        document.getElementById('currentQuestion').innerHTML = d.question[0]
        // show the options
        document.getElementById('currentOptions').style.display = "block"
        // change the options
        console.log(d.question)
        for(let i=1; i<d.question.length; i++){
            if(d.question[i] !== ""){
                var id = "o" + i;
                var option = document.getElementById(id);
                option.style.display = "inline-block"
                option.innerText = d.question[i];
            }else{
                var id = "o" + i;
                document.getElementById(id).style.display = "none"
            }
        }
    })
})

// Recieve a clear from the facilitator
socket.on('clearCurrentQustion', (data) => {
    // clear question and remove options
    document.getElementById('currentQuestion').innerHTML = "waiting for next question"
    document.getElementById('currentOptions').style.display = "none"
})







// FROM ORIGINAL CODE, TO DELETE LATER

// // Recieve over socket
// // recieve position from particpant
// socket.on('position', (data) => {
//     // when you recieve an answer from the server, change the title to that answer
//     // console.log("Recieved position from " + data.id + ": ", data.position)
//     document.getElementById('positionTitle').innerHTML = data.position;
// })

// // Recieve new question from facilitator
// socket.on('sendQuestion', (data) => {
//     console.log("recieved a new question from the facilitator: " + data.question)
// })

