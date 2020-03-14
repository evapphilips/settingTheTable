var mySocketId;

// Access answer section
var svg = d3.select('#answerSection').append('svg')
    .attr('width', "100%")
    .attr('height', "300")
    .append('g')
        .attr("tranform", "translate(0, 0)")


document.getElementById('answerSection').addEventListener('click', (e)=> {
    // show size of screen
    // console.log(e.view.document.body.clientWidth)
    document.getElementById('size').innerHTML = "Your screen size is: " + e.view.document.body.clientWidth

    // move the circle
    var id = '#play' + mySocketId;
    d3.select(id).attr("cx", e.clientX)

    socket.emit('updateCircle', {
        id: mySocketId,
        posX: e.clientX
    })
})
    


// Setup socket
 // connect to the socket server
 var socket = io.connect()
 // tell socket, a playtester connected
 socket.emit('connectPlay', {
    type: "playtest"
})

// Recieve my id
socket.on('shareMyId', (data) => {
    mySocketId = data;
})

// Recieve an updated position from a user
socket.on('shareUpdateCircle', (data)=> {
    var id = '#play' + data.id;
    d3.select(id).attr("cx", data.posX)
})

// Recieve a new user that connected
socket.on('shareNewUser', (data) => {
    console.log('new user: ', data)

    // add a new circle for this user
    svg.append('circle')
        .attr('id', "play" + data)
        .attr('cx', 0)
        .attr('cy', Math.random() * 300)
        .attr('r', 10)
        .attr("opacity", ".5")
})

// Recieve a user that disconnected
socket.on('deleteCircle', (data) => {
    // console.log(data)
    d3.select("#play" + data).remove()
})

// when a question from is submitted
document.getElementById('submitBtn').addEventListener('click', () => {
    // access form
    var form = document.getElementById('questionForm')
    // make form complete object to send
    var formComplete = {
        question: form.question.value,
        opt1: form.opt1.value,
        opt2: form.opt2.value,
        opt3: form.opt3.value,
        opt4: form.opt4.value,
        opt5: form.opt5.value
    }
    // send form complete to server
    socket.emit('formPlayComplete', formComplete)
})

// Recieve a new question
socket.on('sharePlayQuestion', (data) => {
    console.log(data)

    // change the question label
    document.getElementById('questionLabel').innerHTML = data.question
    // change the options label
    document.getElementById('op1').innerHTML = data.opt1;
    document.getElementById('op2').innerHTML = data.opt2;
    document.getElementById('op3').innerHTML = data.opt3;
    document.getElementById('op4').innerHTML = data.opt4;
    document.getElementById('op5').innerHTML = data.opt5;
})

