// Variables
var socket;
var type = 1; // This client is a facilitator (1)
var currentSubmission = [];

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
                    document.getElementById('loginCard').style.display = "none"; 
                    // show the clear button
                    document.getElementById('clearBtn').style.display = "block"
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
                                        // var submissionContainer = document.getElementById('submissionContainer')

                                        // make option string
                                        var optString = ""
                                        for(let i=1; i<submission.question.length; i++){
                                            if(submission.question[i] !== ""){
                                                if(i == 1){
                                                    optString = submission.question[i];
                                                }else{
                                                    optString = optString + ", " + submission.question[i];
                                                }
                                            } 
                                        }
                                        // add new item to submission list
                                        showContent('submissionContainer', submission.question[0], optString, submission._id)
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
                            document.getElementById('loginCard').style.display = "flex";
                            tableInput.value = "";
                        }  
                    })

                    // Recieved a new added submission
                    socket.on('newSubmissionAdded', (data) => {
                        fetch('/submission/find/' + data).then(result => result.json()).then(d => {
                            // add to submission array
                            currentSubmission.push(d.question)
                            // show submission
                             // make option string
                             var optString = ""
                             for(let i=1; i<d.question.length; i++){
                                 if(d.question[i] !== ""){
                                     if(i == 1){
                                         optString = d.question[i];
                                     }else{
                                         optString = optString + ", " + d.question[i];
                                     }
                                 } 
                             }
                             // add new item to submission list
                             showContent('submissionContainer', d.question[0], optString, d._id)
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
function showContent(container, ques, options, id){
    // access submission container
    var element = d3.select('#' + container).append('div')
        .attr("class", "submission_element")
    var left = element.append('div')
        .attr("class", "submission_element_item")
    var detailsLeft = left.append('div')
        .attr("class", "submission_element_details")
    var question = detailsLeft.append('div')
        .attr("class", "submission_element_details-question")
        .text(ques)
    var options = detailsLeft.append('div')
        .attr("class", "submission_element_details-option")
        .text(options)
    var right = element.append('div')
        .attr("class", "submission_element_item")

    var detailsRight = right.append('div')
        .attr("class", "submission_element_details")

    var button = detailsRight.append('button')
        .attr("id", id)
        .attr("class", "btn btn-primary btn-primary-highlight")
        .text("share")
        .on("click", () => {
            // when a send button is pressed, tell the server to send a question
            socket.emit('shareQuestion', id)
        })
}
