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
                alert("Either your username or table code are incorrect.  Make sure to input the same credentials you used to prepare your plate");
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
                //document.getElementById('answerBtn').style.visibility = "visible"
                // make ask button available
                document.getElementById('askBtn').style.display = "block";

                // Recieve a new current question
                socket.on('changeCurrentQuestion', (data) => {
                    // clear any old answers
                    var el = document.getElementsByName("currentAnswer");
                    for(var i=0;i<el.length;i++){
                        el[i].checked = false;
                    }
                    // show submit button
                    document.getElementById('answerBtn').style.visibility = "visible"
                    // undisable the submit button 
                    document.getElementById('answerBtn').disabled = false;
                    // get the current question details fromt he submissions db
                    fetch('/submission/find/' + data).then(result => result.json()).then(d => {
                        // change the current question
                        document.getElementById('currentQuestion').innerHTML = d.question[0]
                        // show the options
                        // document.getElementsByClassName('currentOptions').style.display = "block"
                        var currentOptions = document.getElementsByClassName('currentOptions')
                        // console.log(currentOptions)
                        for(let i=0; i<currentOptions.length; i++){
                            currentOptions[i].style.display = "flex"
                        }

                        // change the options
                        for(let i=1; i<d.question.length; i++){
                            if(d.question[i] !== ""){
                                var id1 = "o" + i;
                                var id2 = "l" + i;
                                var option = document.getElementById(id1);
                                document.getElementById(id1).style.display = "inline-block"
                                document.getElementById(id2).style.display = "inline-block"
                                option.innerHTML = d.question[i];

                            }else{
                                var id1 = "o" + i;
                                var id2 = "l" + i;
                                document.getElementById(id1).style.display = "none"
                                document.getElementById(id2).style.display = "none"
                            }
                        }
                    })
                    
                })

                // Recieve a clear from the facilitator
                socket.on('clearCurrentQustion', (data) => {
                    // hide the submit button 
                    document.getElementById('answerBtn').style.visibility = "hidden"
                    // clear question and remove options
                    document.getElementById('currentQuestion').innerHTML = "waiting for the next question..."
                    // document.getElementById('currentOptions').style.display = "none"
                    var currentOptions = document.getElementsByClassName('currentOptions')
                        // console.log(currentOptions)
                        for(let i=0; i<currentOptions.length; i++){
                            currentOptions[i].style.display = "none"
                        }

                })
            }
        })
    }
})

// Answer form submitted
document.getElementById('answerBtn').addEventListener('click', () => {
    console.log(currentUser._id)
    // console.log(document.getElementsByClassName('joinForm'))
    // when submit is clicked, send the server users answer
    socket.emit('sendCurrentAns', {
        _id: currentUser._id,
        currentAnswer: document.getElementById('joinForm').elements["currentAnswer"].value
    })
    // console.log(document.getElementById('joinForm').elements["currentAnswer"].value)

    // disable the submit button 
    document.getElementById('answerBtn').disabled = true;
})


// Open modal
var askBtn = document.getElementById('askBtn')
askBtn.addEventListener("click", () => {
    document.getElementById("askModal").style.display = "flex";
})
// Close modal
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
    var tab = document.getElementsByClassName("card_tab");
    // show the approriate tab
    tab[n].style.display = "block";
}

// Paging with next/previous button actions
function nextPrev(n){
    // get the tabs
    var tab = document.getElementsByClassName("card_tab");
    // if a field is not filled out, cancel click
    // if (n == 1 && !validateForm()) return false;
    // Hide the current tab:
    tab[currentTab].style.display = "none";
    // Increase or decrease the current tab by 1:
    currentTab = currentTab + n;
    // if you have reached the end of the form...
    if (currentTab >= tab.length) {
        // ... the form gets submitted:
        document.getElementById("joinForm").submit();
        return false;
    }
    // Otherwise, display the correct tab:
    showTab(currentTab);
}


