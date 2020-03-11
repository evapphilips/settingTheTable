
// // Store user type
// var type = "facilitator"



// Variables
var socket;
var type = 1; // This client is a facilitator (1)
var currentSubmission = [];

// When page loads, show login modal
window.addEventListener('load', () => {
    // show modal
    document.getElementById('loginModal').style.display = "block";    
})

// Complete login
var loginBtn = document.getElementById('loginBtn')
loginBtn.addEventListener("click", (e) => {
    // if the table field is empty
    if((tableInput.value == "")){
        alert("make sure to include your table code") 
    }else{ // if fields are filled out
         // check if there is a record of table code in the table db
         fetch('/table/check/' + tableInput.value).then(result => result.json()).then(data => {
             // if the table does not exist
             if(data.message === "failure"){
                 alert("Uh oh! There are no tables with that code.  Check that you have the correct table code.");
                }else{
                    // if the table exists, hide the modal
                    document.getElementById('loginModal').style.display = "none"; 
                    // connect to the socket server
                    socket = io.connect()
                    // send socket, a facilitate connected
                     socket.emit('connectFac', {
                        type: type
                    })

                    // Recieve a fac connection
                    socket.on('checkConnectFac', (data) => {
                        if(data === "success"){
                            console.log("facilitator connected")
                            // load exisiting submission from submission db
                            fetch('/submission/' + tableInput.value).then(result => result.json()).then(data => {
                                // if there are no submissions yet
                                if(data.message === "empty"){
                                    // append a p that says there are no submissions yet
                                    // access the submission container
                                    var submissionContainer = document.getElementById('submissionContainer')
                                    showContent(submissionContainer, "no submissions yet", 'DIV')
                                }else{
                                    // if there are submissions, add them to the current submissions array
                                    data.submissions.forEach((submission) => {
                                        // store submission
                                        currentSubmission.push(submission.question)
                                        // show submission
                                        // access the submission container
                                        var submissionContainer = document.getElementById('submissionContainer')
                                        var newSubmission = showContent(submissionContainer, submission.question[0], 'DIV')
                                        // show options
                                        for(let i=1; i<submission.question.length; i++){
                                            if(submission.question[i] !== ""){
                                                showContent(newSubmission, submission.question[i], 'P')
                                            }  
                                        }
                                        // show send button
                                        showSendBtn(newSubmission, submission._id)
                                    })
                                }
                            }).catch(err => {
                                return err
                            })
                        }else if(data === "failure"){
                            // show an failure alert
                            alert("Uh oh, looks like someone else is already facilitating this table, you have been disconnected")
                            // disconnect this user from the socket
                            socket.disconnect()
                            // show login modal
                            document.getElementById('loginModal').style.display = "block"; 
                        }  
                    })

                    // Recieved a new added submission
                    socket.on('newSubmissionAdded', (data) => {
                        fetch('/submission/find/' + data).then(result => result.json()).then(d => {
                            // add to submission array
                            currentSubmission.push(d.question)
                            // show submission
                            // access the submission container
                            var submissionContainer = document.getElementById('submissionContainer')
                            var newSubmission = showContent(submissionContainer, d.question[0], 'DIV')
                            // show options
                            for(let i=1; i<d.question.length; i++){
                                if(d.question[i] !== ""){
                                    showContent(newSubmission, d.question[i], 'P')
                                }  
                            }
                            // show send button
                            showSendBtn(newSubmission, d._id)
                        })
                    })

                }
    }).catch(err => {
        return err
    })
    }
})

document.getElementById('clearBtn').addEventListener('click', () => {
    socket.emit('clearQuestion', "clear")
})


//////////////// Helper Functions /////////////////////
// add a submission div to the page
function showContent(container, content, type){
    // append content
    var newSubmission = document.createElement(type)
    newSubmission.innerText = content; 
    container.appendChild(newSubmission);
    return newSubmission;
}

// add a send button to the page
function showSendBtn(container, id){
    // prepare append
    var newSubmission = document.createElement('BUTTON')
    newSubmission.innerHTML = "SEND";
    newSubmission.id = id;
    newSubmission.className = 'sendBtn'
    // add even listener
    newSubmission.addEventListener('click', (e) => {
        // when a send button is pressed, tell the server to send a question
        socket.emit('shareQuestion', e.target.id)
    })
    // apend child
    container.appendChild(newSubmission);
    
}







// FROM ORIGINAL CODE, TO DELETE LATER

// // Send over socket
// // When page first loads, send type
// window.addEventListener('load', function () {
//     // send type to the server
//     socket.emit('sendType', {
//         id: socket.id,
//         type: type
//     })
// })

// // Send question to participants and screen
// // get access to button 
// var sendButton = document.getElementById('sendButton')
// // when button is pressed
// sendButton.addEventListener('click', function () {
//     // access question title
//     var questionTitle = document.getElementById('questionTitle')
//     if(questionTitle.innerHTML !== "Facilitator Page"){
//         // send question to the server
//         socket.emit('sendQuestion', {
//             id: socket.id,
//             question: questionTitle.innerHTML
//         })
//     }
// })



// // Recieve over socket
// socket.on('newQuestion', (data) => {
//     // when you recieve a  question from the server, change the title to that question 
//     document.getElementById('questionTitle').innerHTML = "Recieved a question: " + data.question;
// })