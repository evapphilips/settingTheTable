// Variables
var type = 2; // This client is a screen (2)

// Varaibles for simulation
var connectedUsers = [];
var nodes = [];
var svgH = window.innerHeight * .70;
var svgW = (window.innerWidth - 20);
var radius = 100;
var optNum = 0;

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
// var simulation = d3.forceSimulation()
//     .force('attract', d3.forceAttract()
//         .target(function(d) { 
//             if(d.target == 0){
//                 return [0, 0];
//             }else if(d.target === "A"){
//                 return [svgW/(optNum + 1), svgH/2];
//             }else if(d.target === "B"){
//                 return [2*svgW/(optNum + 1), svgH/2];
//             }else if(d.target === "C"){
//                 return [3*svgW/(optNum + 1), svgH/2];
//             }else if(d.target === "D"){
//                 return [4*svgW/(optNum + 1), svgH/2];
//             }else if(d.target === "E"){
//                 return [5*svgW/(optNum + 1), svgH/2];
//             }else{
//                 return[0, 0];
//             }
//         }) // the initial attraction point
//         .strength(0.1)) 
//     .force('collide', d3.forceCollide(function (d) { return d.r; }))
//     .on("tick", () => {
//         circles
//             .attr('cx', function(d) { return d.x})
//             .attr('cy', function(d) { return d.y})
//     })
//     .velocityDecay(.6)
//     .nodes(nodes)

// setup simulation
var strTog = 0.1;
var strAp = 0.005;
var simulation = d3.forceSimulation()
    .force('attract', d3.forceAttract()
        .target(function(d) { 
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
        .strength(strTog)) 
    .force('collide', d3.forceCollide(function (d) { return d.r; })
        .strength(strAp))
    .on("tick", () => {
        plateDiv.style("transform", function(d) { 
            // console.log("change", d)
            var str = "translate(" + d.x + "px, " + d.y + "px)";
            return str
        })
    })
    .velocityDecay(.6)
    .nodes(nodes)


// // create an svg group inside the chart elements
var chart = d3.select('#chart')

// chart.append('svg')
//     .attr("width", "100%")
//     .attr("height", "70vh")
//     .attr("style", "background-color: white")
    
    // .attr("style", "border-radius: 2rem")
    // .append('g')
    // .attr("transform", "translate(0, 0)")

// access container div
var container = d3.select('.container_pres-card')

// // add defs to this page
// var defs = svg.append('defs')

// // add pattern
// defs.append("pattern")
//     .attr("id", "logo-img")
//     .attr("height", "100%")
//     .attr("width", "100%")
//     .attr("patternContentUnits", "objectBoundingBox")
//         .append('image')
//         .attr("height", "1")
//         .attr("width", "1")
//         .attr("preserveAspectRatio", "none")
//         .attr("xmlns:xlink", "http://www.w3.org/1999/xlink")
//         .attr("xlink:href", "assets/logo.png")

// // add circles to the svg
// var circles = svg.selectAll('circle')
//     .data(nodes)
//     .enter()
//         .append('circle')
//             .attr('id', function (d) { return "part" + d.id})
//             .attr('cx', function (d) { return d.x; })
//             .attr('cy', function (d) { return d.y; })
//             .attr('r', function (d) { return d.r; })
//             .style("fill", "url(#logo-img)")

// add a div to put a plate inside
var plateDiv = container.selectAll('div')
    .data(nodes)
    .enter().append('div')
        .attr('id', function (d) { return "part" + d.id})
        .style("width", function (d) { return d.r1; })
        .style("height", function (d) { return d.r1; })
        .style('background-color', "red")
        .style('border-radius', "100px")
        .attr('x', function (d) { return d.x; })
        .attr('y', function (d) { return d.y; })
        .style("transform", function(d) { 
            var str = "translate(" + d.x1 + ", " + d.y1 + ")";
            return str
        })

// add svg to each plate div
var plateSvg = plateDiv.append('svg')
.attr("width", radius + "px")
.attr("height", radius + "px")

// Recieve an _id from a connected participant
socket.on('shareConnectedPartId', (data) => {
    console.log("recieved a connected user id: ", data);

    // add new connected participant to connectedUsers array
    connectedUsers.push(data)
    // console.log(connectedUsers)

    // get this users data from the db
    var answers = [];
    fetch('/user/find/' + data).then(result => result.json()).then(d => {
        d.answers.forEach((ans) => {
            console.log("a", ans)
            answers.push(ans)
        })
    }).then(() => {
        // create a new node
    var newNode = {
        x: svgW * Math.random(),
        y: svgH * Math.random(),
        x1: svgW * Math.random() + "px",
        y1: svgH * Math.random() + "px",
        r: radius,
        r1: radius + "px",
        target: 0,
        id: data
    }

    // // add a circle
    // chart.append('circle')
    //     .data([newNode])
    //     .attr('id', function (d) { return "part" + d.id})
    //     .attr("cx", function(d) {return d.x})
    //     .attr("cy", function(d) {return d.y})
    //     .attr('r', function (d) { return d.r; })
    //     .style("fill", "url(#logo-img)")

    var plate = chart.append('div')
        .data([newNode])
        .attr('id', function (d) { return "part" + d.id})
        .style("width", function (d) { return d.r1; })
        .style("height", function (d) { return d.r1; })
        // .style('background-color', "red")
        .style('border-radius', "100px")
        .attr('x', function (d) { return d.x; })
        .attr('y', function (d) { return d.y; })
        .style("transform", function(d) { 
            var str = "translate(" + d.x1 + ", " + d.y1 + ")";
            return str
        })
    
    var plateSvg = plate.append('svg')
        .attr("width", radius + "px")
        .attr("height", radius + "px")

        plateSvg.append('use')
        .attr("x", "0") // 80/32
        .attr("y", "0")
        .attr("transform", "scale(4.75)")
        .attr("xlink:href", function () {
            // console.log(answers[0])
            if(answers[0] === 0){
                return "#component-1-0"
            }
            if(answers[0] === 1){
                return "#component-1-1"
            }
            if(answers[0] === 2){
                return "#component-1-2"
            }
            if(answers[0] === 3){
                return "#component-1-3"
            }
        })
        // .attr("fill", "url('#myGradient')")
        .attr("stroke", "none")
        // .attr("stroke-width", ".25")
        .attr("fill", function () {
            var q2Symbol = ["#D25D50", "#E186A7", "#ABABCF", "#FF8D44", "#EACA81"];
            if(answers[1] === 0){
                return q2Symbol[0];
            }
            if(answers[1] === 1){
                return q2Symbol[1];
            }
            if(answers[1] === 2){
                return q2Symbol[2];
            }
            if(answers[1] === 3){
                return q2Symbol[3];
            }
        })

    plateSvg.append('use')
            .attr("x", function () {
                if(answers[2] === 0){
                    return "8";
                }
                if(answers[2] === 1){
                    return "20"
                }
                if(answers[2] === 2){
                    return "8"
                }
                if(answers[2] === 3){
                    return "20"
                }
            }) 
            .attr("y", function () {
                if(answers[2] === 0){
                    return "8";
                }
                if(answers[2] === 1){
                    return "8"
                }
                if(answers[2] === 2){
                    return "26"
                }
                if(answers[2] === 3){
                    return "26"
                }
                
            })
            // .attr("x", "6")
            // .attr("y", "26")
            .attr("transform", "scale(2)")
            // .attr("xlink:href", "#component-3-2")
            .attr("xlink:href", function () {
                // console.log(answers[0])
                if(answers[2] === 0){
                    return "#component-3-0"
                }
                if(answers[2] === 1){
                    return "#component-3-1"
                }
                if(answers[2] === 2){
                    return "#component-3-2"
                }
                if(answers[2] === 3){
                    return "#component-3-3"
                }
            })
            .attr("stroke", "white")
            .attr("stroke-width", ".125")
            .attr("fill", "none")
            .attr("opacity", ".75")

    plateSvg.append('use')
    .attr("x", function () {
        if(answers[3] === 0){
            return "3.5";
        }
        if(answers[3] === 1){
            return "3.5"
        }
        if(answers[3] === 2){
            return "3.5"
        }
        if(answers[3] === 3){
            return "3.5"
        }
    }) 
    .attr("y", function () {
        if(answers[3] === 0){
            return "3.75";
        }
        if(answers[3] === 1){
            return "3.5"
        }
        if(answers[3] === 2){
            return "3.95"
        }
        if(answers[3] === 3){
            return "3.0"
        }
        
    })
            // .attr("x", "3.5") 
            // .attr("y", "3.0")
            .attr("transform", "scale(3.75)")
            // .attr("xlink:href", "#icon-check")
            // .attr("xlink:href", "#component-4-3")
            .attr("xlink:href", function () {
                // console.log(answers[0])
                if(answers[3] === 0){
                    return "#component-4-0"
                }
                if(answers[3] === 1){
                    return "#component-4-1"
                }
                if(answers[3] === 2){
                    return "#component-4-2"
                }
                if(answers[3] === 3){
                    return "#component-4-3"
                }
            })
            .attr("stroke", function () {
                var q5Symbol = ["#FFAACB", "#FFFFFF", "#F8EF6C"];
                if(answers[4] === 0){
                    return q5Symbol[0];
                }
                if(answers[4] === 1){
                    return q5Symbol[1];
                }
                if(answers[4] === 2){
                    return q5Symbol[2];
                }
            })
            .attr("stroke-width", ".25")
            .attr("fill", function () {
                var q5Symbol = ["#FFAACB", "#FFFFFF", "#F8EF6C"];
                if(answers[4] === 0){
                    return q5Symbol[0];
                }
                if(answers[4] === 1){
                    return q5Symbol[1];
                }
                if(answers[4] === 2){
                    return q5Symbol[2];
                }
            })
            .attr("opacity", ".5")

    plateSvg.append('use')
    .attr("x", function () {
        if(answers[5] === 0){
            return "10";
        }
        if(answers[5] === 1){
            return "35"
        }
        if(answers[5] === 2){
            return "10"
        }
        if(answers[5] === 3){
            return "35"
        }
    }) 
    .attr("y", function () {
        if(answers[5] === 0){
            return "15";
        }
        if(answers[5] === 1){
            return "15"
        }
        if(answers[5] === 2){
            return "35"
        }
        if(answers[5] === 3){
            return "35"
        }
        
    })
            // .attr("x", "10") 
            // .attr("y", "35")
            .attr("transform", "scale(1)")
            // .attr("xlink:href", "#icon-check")
            // .attr("xlink:href", "#component-6-3")
            .attr("xlink:href", function () {
                // console.log(answers[0])
                if(answers[6] === 0){
                    return "#component-7-0"
                }
                if(answers[6] === 1){
                    return "#component-7-1"
                }
                if(answers[6] === 2){
                    return "#component-7-2"
                }
                if(answers[6] === 3){
                    return "#component-7-3"
                }
            })
            // .attr("fill", "url('#myGradient')")
            .attr("stroke", "none")
            .attr("stroke-width", ".25")
            .attr("fill", "white")
            .attr("opacity", ".5")


    // update circles definition
    // circles = chart.selectAll('circle')
    plateDiv = chart.selectAll('div')
    
    // add node to nodes array
    nodes.push(newNode);

    // restart simulation
    simulation
        .alphaTarget(0.3)
        .restart()
        .nodes(nodes)
    })


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
    document.getElementById('currentQuestion').innerHTML = "Waiting for next question..."
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




