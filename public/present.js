// Variables
var type = 2; // This client is a screen (2)

// Varaibles for simulation
var connectedUsers = [];
var nodes = [];
var svgH = window.innerHeight * .70;
var svgW = (window.innerWidth - 20);
var radius = 20;
var optNum = 0;

//


// Setup socket
 // connect to the socket server
 var socket = io.connect()
 // send socket, a screen connected
 socket.emit('connectScr', {
     type: type
 })

// Recieve a screen connect
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

// setup simulation
var simulation = d3.forceSimulation()
    .force('attract', d3.forceAttract()
        .target(function(d) { 
            console.log(optNum)
            if(d.target == 0){
                return [0, 0];
            }else if(d.target === "A"){
                return [svgW/(optNum + 1), svgH/2];
            }else if(d.target === "B"){
                return [2*svgW/(optNum + 1), svgH/2];
            }else if(d.target === "C"){
                return [3*svgW/(optNum + 1), svgH/2];
            }else if(d.target === "D"){
                return [4*svgW/(optNum + 1), svgH/2];
            }else if(d.target === "E"){
                return [5*svgW/(optNum + 1), svgH/2];
            }else{
                return[0, 0];
            }
        }) // the initial attraction point
        .strength(0.1)) 
    .force('collide', d3.forceCollide(function (d) { return d.r; }))
    .on("tick", () => {
        circles
            .attr('cx', function(d) { return d.x})
            .attr('cy', function(d) { return d.y})
    })
    .velocityDecay(.6)
    .nodes(nodes)

// create an svg group inside the chart elements
var svg = d3.select('#chart').append('svg')
    .attr("width", "100%")
    .attr("height", "70vh")
    .attr("style", "background-color: white")
    
    // .attr("style", "border-radius: 2rem")
    .append('g')
    .attr("transform", "translate(0, 0)")

// add circles to the svg
var circles = svg.selectAll('circle')
    .data(nodes)
    .enter().append('circle')
        .attr('id', function (d) { return "part" + d.id})
        .attr('cx', function (d) { return d.x; })
        .attr('cy', function (d) { return d.y; })
        .attr('r', function (d) { return d.r; })

    
// Recieve an _id from a connected participant
socket.on('shareConnectedPartId', (data) => {
    console.log("recieved a connected user id: ", data);

    // add new connected participant to connectedUsers array
    connectedUsers.push(data)
    // console.log(connectedUsers)

    // create a new node
    var newNode = {
        x: svgW * Math.random(),
        y: svgH * Math.random(),
        r: radius,
        target: 0,
        id: data
    }

    // add a circle
    svg.append('circle')
        .data([newNode])
        .attr('id', function (d) { return "part" + d.id})
        .attr("cx", function(d) {return d.x})
        .attr("cy", function(d) {return d.y})
        .attr('r', function (d) { return d.r; })

    // update circles definition
    circles = svg.selectAll('circle')
    
    // add node to nodes array
    nodes.push(newNode);

    // restart simulation
    simulation
        .alphaTarget(0.3)
        .restart()
        .nodes(nodes)
})

// Recieve an _id from a disconnected participant
socket.on('shareDisconnectedPartId' ,(data) => {
    console.log("recieved a disconnected user id: ", data)

    if(connectedUsers.indexOf(data) >= 0){
        // get index
    var index = connectedUsers.indexOf(data)

    // remove from connectedUsers
    connectedUsers.splice(index, 1)

    // remove from circles
    console.log('#part' + data)
    d3.select('#part' + data)
        .remove()

    // remove from nodes
    nodes.splice(index, 1)
    }

    // restart simulation
    simulation
        .alphaTarget(0.3)
        .restart()
        .nodes(nodes)
})

// Recieved an _id and answer from a connected participant
socket.on('newAnswerShared', (data) => {
    console.log("Recieved answer " + data.currentAnswer + " from user: " + data._id)

    nodes[connectedUsers.indexOf(data._id)].target = data.currentAnswer

    simulation
        .alphaTarget(0.3)
        .restart()
        .nodes(nodes)
})

// Recieve a new current question 
socket.on('changeCurrentQuestion', (data) => {
    // force all nodes to original target
    connectedUsers.forEach((user) => {
        nodes[connectedUsers.indexOf(user)].target = 0
    })

    simulation
        .alphaTarget(0.3)
        .restart()
        .nodes(nodes)

    // get the current question details fromt he submissions db
    fetch('/submission/find/' + data).then(result => result.json()).then(d => {
        // change the current question
        document.getElementById('currentQuestion').innerHTML = "Question: " + d.question[0]
        // show the options
        document.getElementById('currentLabels').style.display = "flex"
        document.getElementById('currentAxis').style.display = "flex"
        // change the option labels
        // console.log(d.question)
        // store number of options
        optNum = 0;
        for(let i=1; i<d.question.length; i++){
            if(d.question[i] !== ""){
                var id_o = "o" + i;
                var id_a = "a" + i;
                var option = document.getElementById(id_o);
                var tick = document.getElementById(id_a);
                option.style.display = "inline-block"
                tick.style.display = "inline-block"
                option.innerText = d.question[i];
                console.log("hi")
                optNum ++
                console.log(optNum)
            }else{
                var id_o  = "o" + i;
                var id_a = "a" + i;
                document.getElementById(id_o).style.display = "none"
                document.getElementById(id_a).style.display = "none"
            }
        }

            })
        })

        


// Recieve a clear from the facilitator
socket.on('clearCurrentQustion', (data) => {
    // clear question and remove options
    document.getElementById('currentQuestion').innerHTML = "waiting for next question"
    document.getElementById('currentLabels').style.display = "none"
    document.getElementById('currentAxis').style.display = "none"

    // force all nodes to original target
    connectedUsers.forEach((user) => {
        nodes[connectedUsers.indexOf(user)].target = 0
    })

    simulation
        .alphaTarget(0.3)
        .restart()
        .nodes(nodes)
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

// // access plateContainer div to put svg's into
// var plateContainer = d3.select(".plateContainer")
// // plateContainer.append('svg')

// // Recieve an _id from a connected participant
// socket.on('shareConnectedPartId', (data) => {
//     // console.log("recieved a connected user id: ", data);
//     // get svg src from this participant
//     fetch('/user/find/' + data).then(result => result.json()).then(d => {
//         // append svg to plateContainer
//         plateContainer.append('img')
//             // .attr('id', data)
//             .attr('id', "pl" + data)
//             .attr("src", d.src)
//             .attr('width', 100)
//             .attr('height', 100)     
//     })
// })

// // Recieve an _id from a disconnected participant
// socket.on('shareDisconnectedPartId', (data) => {
//     console.log("recieve a disconnected user id: ", data);

//     // remove the appropriate plate
//     d3.select(".plateContainer").selectAll('#pl' + data).remove()
// })

