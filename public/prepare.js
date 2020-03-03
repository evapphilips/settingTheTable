// Local variables
var currentTab = 0;
var currentNames = [];
var currentTables = [];

// When page first loads, get a list of current user names and table names
window.addEventListener('load', function () {
    // user names
    fetch('/user').then(result => {
        return result.json();
    }).then(result => {
        result.forEach((user) => {
            // add to currentNames array
            currentNames.push(user.name)
        })
    }).catch(err => {
        return err;
    })

    // table names
    fetch('/table').then(result => {
        return result.json();
    }).then(result => {
        result.forEach((table) => {
            // add to currentNames array
            currentTables.push(table.tableCode)
        })
    }).catch(err => {
        return err;
    })
})

// access name and table inputs
var nameInput = document.getElementById('nameInput')
var tableInput = document.getElementById('tableInput')
// When name is completed
nameInput.addEventListener('blur', function (e) {
    currentNames.forEach((name) => {
        if(name === e.target.value){
            alert("Uh oh! That name has already been used.  Try a different username.");
        }
    })
    if(document.getElementById('tableInput').value !== "" ){
        document.getElementById("nextBtn").disabled = false;
    }
})
// When table is completed
tableInput.addEventListener('blur', function (e) {
    var foundMatch = false;
    currentTables.forEach((tableCode) => {
        if(tableCode === e.target.value){
            foundMatch = true;
        }
    })
    if(nameInput.value !== ""){
        document.getElementById("nextBtn").disabled = false;
    }
    if(!foundMatch){
        alert("Uh oh! There are not tables with that code.  Check that you have the correct table code.");
    }
})


// Page through pre questions
// Display the current tab
showTab(currentTab);
// When user clicks on next/prev button, page
// access buttons
var nextBtn = document.getElementById('nextBtn')
var prevBtn = document.getElementById('prevBtn')
// preform action on click
nextBtn.addEventListener('click', () => {nextPrev(1);});
prevBtn.addEventListener('click', () => {nextPrev(-1);});




//////////////// Helper Functions /////////////////////
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

// Show the approprate question tab
function showTab(n) {
    // get the tabs
    var tab = document.getElementsByClassName("tab");
    // show the approriate tab
    tab[n].style.display = "block";

    // show the prev/next buttons
    if(n==0){
        // hide prev and submit
        document.getElementById("prevBtn").style.display = "none";
        document.getElementById('prepSubmitBtn').style.display = "none";
        // disable next
        if(document.getElementById('nameInput').value == "" && document.getElementById('tableInput').value == ""){
            // disable next
            document.getElementById("nextBtn").disabled = true;
        }
    }else{
        // show prev
        document.getElementById("prevBtn").style.display = "inline";
    }
    if (n == (tab.length - 1)) {
        // hide next and show submit
        document.getElementById("nextBtn").style.display = "none"
        document.getElementById("prepSubmitBtn").style.display = "inline";
    }else {
        // show next and hide submit
        document.getElementById("nextBtn").style.display = "inline"
        document.getElementById("prepSubmitBtn").style.display = "none";
      }  
}

