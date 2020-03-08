// Variables
var socket;
var currentTab = 0;
var type = 0; // This client is a participant (0)
var currentUser = {};

// When page first loads, display the login tab
showTab(currentTab);

// Complete login
var loginBtn = document.getElementById('loginBtn')
loginBtn.addEventListener("click", (e) => {
    // if fields are empty
    if((nameInput.value == "") || (tableInput.value == "")){
        alert("make sure to include your login credentials") 
    }else{ // if fields are filled out
        // check if there is a record of that user/table combo on the users db
        fetch('/user/find/' + nameInput.value + "/" + tableInput.value).then(result => result.json()).then(data => {
            // if there is not user/table combo
            if(data.message == "failure"){
                alert("Uh oh! Either your username or table code are incorrect.  Make sure it input the same credentials you prepared with");
            }else{ // if there is a user/table combo
                // store this user info as the current user
                currentUser = data.info
                // connect to the socket server
                socket = io.connect()
                // send socket user information
                socket.emit('connectPart', {
                    type: type,
                    id: currentUser._id
                })
                // change to next tab
                nextPrev(1)
                loginBtn.style.visibility = "hidden"
                document.getElementById('answerBtn').style.visibility = "visible"
                // make ask button available
                document.getElementById('askBtn').disabled = false;
            }
        })
    }
})

// Answer form submitted
document.getElementById('answerBtn').addEventListener('click', () => {
    console.log(currentUser._id)
    // when submit is clicked, send the server users answer
    socket.emit('sendCurrentAns', {
        _id: currentUser._id,
        currentAnswer: document.getElementById('joinForm').elements["currentAnswer"].value
    })
    console.log(document.getElementById('joinForm').elements["currentAnswer"].value)
})


// Open modal
var askBtn = document.getElementById('askBtn')
askBtn.addEventListener("click", () => {
    document.getElementById("askModal").style.display = "block";
})
document.getElementById('closeModal').addEventListener("click", () => {
    document.getElementById("askModal").style.display = "none";
})

// Submit modal
document.getElementById('submitAskBtn').addEventListener('click', () => {
    // access form fields
    var inputQues = document.getElementById('inputQues')
    var inputOpts = document.getElementsByClassName('inputOpt')
    // check is required fields are completed
    if(inputQues.value !== "" && inputOpts[0].value !== "" && inputOpts[1].value !== ""){
        // make array of the submission
        var submission = [inputQues.value, inputOpts[0].value, inputOpts[1].value, inputOpts[2].value, inputOpts[3].value, inputOpts[4].value]
        // send a new to the /submission database collection
        var submissionId;
        const newEntry = {
            tableCode: currentUser.tableCode,
            question: submission
        }
        const options ={
            method: "POST",
            redirect: "follow",
            headers: {
                "Content-Type": "application/json",
            },
                body:JSON.stringify(newEntry)
            }
        fetch('/submission/create', options).then(result => result.json()).then(data => {
            return submissionId = data;
        }).catch(err => {
            return err
        }).then((id) => {
            // send socket new submission
            socket.emit('submitNewQuestion', id);
        })
        // clear and close the modal
        inputQues.value = "";
        for(i=0; i<inputOpts.length; i++){
            inputOpts[i].value = "";
        }
        document.getElementById("askModal").style.display = "none";

    }else{
        alert("Looks you have not completed the required feilds")
    }
})

//////////////// Helper Functions /////////////////////
// Show the approprate question tab
function showTab(n) {
    // get the tabs
    var tab = document.getElementsByClassName("tab");
    // show the approriate tab
    tab[n].style.display = "block";
}

// Paging with next/previous button actions
function nextPrev(n){
    // get the tabs
    var tab = document.getElementsByClassName("tab");
    // if a field is not filled out, cancel click
    // if (n == 1 && !validateForm()) return false;
    // Hide the current tab:
    tab[currentTab].style.display = "none";
    // Increase or decrease the current tab by 1:
    currentTab = currentTab + n;
    // if you have reached the end of the form...
    if (currentTab >= tab.length) {
        // ... the form gets submitted:
        document.getElementById("prepForm").submit();
        return false;
    }
    // Otherwise, display the correct tab:
    showTab(currentTab);
}




// FROM ORIGINAL CODE, TO DELETE LATER

// // When page first loads, send type
// window.addEventListener('load', function () {
//     // send type to the server
//     socket.emit('sendType', {
//         id: socket.id,
//         type: type
//     })
// })

// // Get position value and send to server
// // access submit button
// var submitButton = document.getElementById('submit-button')
// // when submit button is clicked
// submitButton.addEventListener("click", function () {
//     // access the form
//     var form = document.getElementById("form");

//     // send position to the server
//     socket.emit('position', {
//         id: socket.id,
//         type: type,
//         position: form.elements["position"].value
//     })
// })

// // Get question value and send to server
// // access send button 
// var sendButton = document.getElementById('send-button')
// // when send button is clicked
// sendButton.addEventListener("click", function () {
//     // access input text
//     var question = document.getElementById("question");

//     // send question to the server
//     socket.emit('newQuestion', {
//         id: socket.id,
//         type: type,
//         question: question.value
//     })
// })

// // Recieve over socket
// // // Recieve data from server
// // socket.on('position', (data) => {
// //     console.log("Recieved position from " + data.id + ": ", data.position)
// // })

// // Recieve new question from facilitator
// socket.on('sendQuestion', (data) => {
//     console.log("recieved a new question from the facilitator" + data.question)
// })



