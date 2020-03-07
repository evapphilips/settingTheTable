// // Start socket connection (frontend)
var socket;

// Variables
var currentTab = 0;
var type = 0;
var userList = [];
var currentUser = {};
var currentTable = {};



// When page first loads, get a list of current users with 
window.addEventListener('load', function () {
    // user users
    fetch('/user').then(result => {
        return result.json();
    }).then(result => {
        result.forEach((user) => {
            // add to currentNames array
            userList.push(user)
        })
    }).catch(err => {
        return err;
    })

})

// Display the current tab
showTab(currentTab);

// When the user clicks login, start socket connection and join appropriate table
var loginBtn = document.getElementById('loginBtn')
loginBtn.addEventListener("click", (e) => {
    if((nameInput.value == "") || (tableInput.value == "")){
        return 
    }else{
        // check if the user exists with that table
        userList.forEach((user) => {
            if((nameInput.value == user.name) && (tableInput.value == user.tableCode)){
                // store this info as the current user 
                currentUser = user
                // connect to socket server
                socket = io.connect()
                // send socket user information
                socket.emit('connectUser', {
                    type: type,
                    info: currentUser
                })

            // change to next tab
            nextPrev(1)
            loginBtn.style.visibility = "hidden"
            document.getElementById('answerBtn').style.visibility = "visible"
            // make ask button available
            document.getElementById('askBtn').disabled = false;
            }else{
                alert("Uh oh! Either your username or table code are incorrect.  Make sure it input the same credentials you prepared with");
            }
        })
        
    }
})

// When a user clicks ask a question, open modal
var askBtn = document.getElementById('askBtn')
askBtn.addEventListener("click", () => {
    document.getElementById("askModal").style.display = "block";
})
document.getElementById('closeModal').addEventListener("click", () => {
    document.getElementById("askModal").style.display = "none";
})

// When a user clicks submit on modal
document.getElementById('submitAskBtn').addEventListener('click', () => {
    // access form fields
    var inputQues = document.getElementById('inputQues')
    var inputOpts = document.getElementsByClassName('inputOpt')
    // check is required fields are completed
    if(inputQues.value !== "" && inputOpts[0].value !== "" && inputOpts[1].value !== ""){
        // make array of the submission
        var submission = [inputQues.value, inputOpts[0].value, inputOpts[1].value, inputOpts[2].value, inputOpts[3].value, inputOpts[4].value]
        // need to send to a new collection here
        // send socket new submission
        socket.emit('submitNewQuestion', submission);
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




// Send over Socket

// Send

// Recieve





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