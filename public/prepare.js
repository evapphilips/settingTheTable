// Local variables
var currentTab = 0;
var prepQuestions = [];
var q2Symbol = ["#D25D50", "#E186A7", "#ABABCF", "#FF8D44", "#EACA81"];
var q5Symbol = ["#FFAACB", "#FFFFFF", "#F8EF6C"];
var q6Symbol = [["40%", "40%"], ["60%", "40%"], ["40%", "60%"], ["60%", "60%"]];
var q7Symbol = ["10", "20", "30", "40"];
var ans = ["", "", "", "", "", "", ""];


// When completing registration
// when name is completed
var nameCheck = false;
var nameInput = document.getElementById('nameInput')
nameInput.addEventListener('blur', function (e) {
    // check is name has already been taken
    fetch('/user/check/' + e.target.value).then(result => result.json()).then(data => {
        // if the name is already taken
        if(data.message === "failure"){
            alert("Uh oh! That name has already been used.  Try a different username.");
            nameCheck = false;
        }else{
            nameCheck = true;
            // if the name is not taken
            // check is the next button should still be disabled
            if(document.getElementById('tableInput').value !== "" ){
                document.getElementById("nextBtn").disabled = false;
                
            }
            return
        }
    }).catch(err => {
        return err
    })
})
// When table is completed
var tableInput = document.getElementById('tableInput')
tableInput.addEventListener('blur', function (e) {
    // check is there is a table by that name
    fetch('/table/check/' + e.target.value).then(result => result.json()).then(data => {
        // if the table does not exist
        if(data.message === "failure"){
            alert("Uh oh! There are no tables with that code.  Check that you have the correct table code.");
        }else{
            // if the table exists, get the doc
            prepQuestions = [data.doc.prepQuestion1, data.doc.prepQuestion2, data.doc.prepQuestion3, data.doc.prepQuestion4, data.doc.prepQuestion5, data.doc.prepQuestion6, data.doc.prepQuestion7]
            if((nameInput.value !== "") && nameCheck){
                document.getElementById("nextBtn").disabled = false;
            }
        }
    }).catch(err => {
        return err
    })
})


// Page through prepare questions
// Display the current tab
showTab(currentTab);
// When user clicks on next/prev button, page
// access buttons
var nextBtn = document.getElementById('nextBtn')
var prevBtn = document.getElementById('prevBtn')
// preform action on click
nextBtn.addEventListener('click', () => {nextPrev(1);});
prevBtn.addEventListener('click', () => {nextPrev(-1);});


// When submit is pressed, post new user to users collection
var prepSubmitBtn = document.getElementById("prepSubmitBtn")
prepSubmitBtn.addEventListener("click", (e) => {
    // hide back button
    document.getElementById("prevBtn").style.visibility = "hidden"
    // make a plate svg source
    var html = d3.select(".plateContainer")
        .attr("version", 1.1)
        .attr("xmlns", "http://www.w3.org/2000/svg")
        .node().parentNode.innerHTML;
    var imgsrc = 'data:image/svg+xml;base64,'+ btoa(html);

    // make new entry
    const newEntry = {
        role: 0,
        name: document.getElementById('nameInput').value,
        tableCode: document.getElementById('tableInput').value,
        prepAnswers: ans,
        plateSvg: null // NOT SENDING IMG SRC FOR NOW, TOO BIG
    }
    const options ={
        method: "POST",
        redirect: "follow",
        headers: {
            "Content-Type": "application/json",
        },
            body:JSON.stringify(newEntry)
        }
    // create new user post
    fetch('/user/create', options).then(result => result.json()).then(data => {
        console.log(data.message) // LATER I WILL WANT TO PAGE TO THE LAST THANK YOU TAB HERE
        return
    }).catch(err => {
        return err
    })
})


//////////////// Helper Functions /////////////////////
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
        document.getElementById("prepForm").submit();
        return false;
    }
    // Otherwise, display the correct tab:
    showTab(currentTab);
}

// Show the approprate question tab
function showTab(n) {
    // get the tabs
    var tab = document.getElementsByClassName("card_tab");
    // show the approriate tab
    tab[n].style.display = "block";

    // show appropriate questions based on the table name and look at selection
    if(n>0){
        var id = "ques" + n;
        document.getElementById(id).innerHTML = prepQuestions[n-1];

        
        // when a radio button is pressed, find the appropriate path to change
        for(let i=0; i<tab[n].getElementsByTagName('input').length; i++){
            //options.push(document.getElementById("q" + n + (i+1)))
            document.getElementById("q" + n + (i+1)).addEventListener('change', () => {
                // adding symbol for question 1
                if(document.getElementById("q" + n + (i+1)).checked && (n==1)){
                    // remove base plate
                    d3.select(".plateContainer").selectAll(".basePlate").remove()
                    // remove already existing ans symbol
                    d3.select(".plateContainer").selectAll(".q1Symbol").remove()
                    // add new ans symbol
                    d3.select(".plateContainer").append("use")
                        .attr("class", "q1Symbol")
                        .attr("xlink:href", "assets/components.svg#component-1-" + i)
                        .attr("stroke", "black")
                        .attr("fill", "none");  
                    // add ans to ans array
                    ans[n-1] = i;                   
                }


                // changing color for question 2
                if(document.getElementById("q" + n + (i+1)).checked && (n==2)){
                    // change color
                    d3.select(".q1Symbol")
                        .style("fill", q2Symbol[i])
                        .style("stroke", "none")
                    // add ans to ans array
                    ans[n-1] = i;
                }
                // adding symbol for question 3
                if(document.getElementById("q" + n + (i+1)).checked && (n==3)){
                    // remove already existing ans symbol
                    d3.select(".plateContainer").selectAll(".q3Symbol").remove()
                    // add new ans symbol   
                    d3.select(".plateContainer").append("use")
                        .attr("class", "q3Symbol")
                        // .attr("d", q3Symbol[i])
                        .attr("xlink:href", "assets/components.svg#component-3-" + i)
                        .attr("stroke", "white")
                        .attr("stroke-width", "2px")
                        .attr("fill", "none") 
                        .attr("opacity", ".5")
                        if(i==0){
                            d3.select(".q3Symbol").style("transform", "translate(10%, 15%)") 
                        }else if(i==1){
                            d3.select(".q3Symbol").style("transform", "translate(45%, 15%)") 
                        }else if(i==2){
                            d3.select(".q3Symbol").style("transform", "translate(10%, 51%)") 
                        }else if(i==3){
                            d3.select(".q3Symbol").style("transform", "translate(45%, 53%)") 
                        }
                    // add ans to ans array
                    ans[n-1] = i;
                }
                // adding symbol for question 4
                if(document.getElementById("q" + n + (i+1)).checked && (n==4)){
                    // remove already existing ans symbol
                    d3.select(".plateContainer").selectAll(".q4Symbol").remove()
                    // add new ans symbol
                    d3.select(".plateContainer").append('use')
                        .attr("class", "q4Symbol")
                        .attr("xlink:href", "assets/components.svg#component-4-" + i)
                        .attr("fill", "white")
                        .attr("stroke", "none") 
                        .attr("opacity", ".9")
                        .style("transform", () => {
                            if(i == 0){
                                return "translate(10%, 12%)"
                            }
                            if(i == 1){
                                return "translate(12%, 14%)"
                            }
                            if(i == 2){
                                return "translate(12%, 14%)"
                            }
                            if(i == 3){
                                return "translate(12%, 12%)"
                            }
                        })
                    // add ans to ans array
                    ans[n-1] = i;
                }



                // changing color for question 5
                if(document.getElementById("q" + n + (i+1)).checked && (n==5)){
                    // change color
                    d3.selectAll(".q4Symbol")
                        .style("fill", q5Symbol[i])
                        .attr("stroke", "none")
                        .attr("opacity", ".5")
                    // add ans to ans array
                    ans[n-1] = i;
                }

                // adding symbol for question 6
                if(document.getElementById("q" + n + (i+1)).checked && (n==6)){
                    // remove already existing symbol
                    d3.select(".plateContainer").selectAll(".q6Symbol").remove()
                    // add new symbol
                    d3.select(".plateContainer").append('circle')
                        .attr("class", "q6Symbol")
                        .attr("cx", q6Symbol[i][0])
                        .attr("cy", q6Symbol[i][1])
                        .attr("r", "40")
                        .attr("fill", "white")
                        .attr("opacity", ".2")
                    // add ans to ans array
                    ans[n-1] = i;
                }

                // chaingin size for question 7
                if(document.getElementById("q" + n + (i+1)).checked && (n==7)){
                    // chnage size
                    d3.selectAll(".q6Symbol")
                        .style("r", q7Symbol[i])
                    // add ans to ans array
                    ans[n-1] = i;

                    document.getElementById("prepSubmitBtn").disabled = false;
                }
            })
        }


    }

    // show the prev/next buttons
    if(n==0){
        // hide prev and submit
        document.getElementById("prevBtn").style.visibility = "hidden";
        document.getElementById('prepSubmitBtn').style.display = "none";
        // disable next
        if(document.getElementById('nameInput').value == "" && document.getElementById('tableInput').value == ""){
            // disable next
            document.getElementById("nextBtn").disabled = true;
        }
    }else{
        // show prev
        document.getElementById("prevBtn").style.visibility = "visible";
    }
    if (n == (tab.length - 1)) {
        // hide next and show submit
        document.getElementById("nextBtn").style.visibility = "hidden"
        document.getElementById("prepSubmitBtn").style.display = "block";
        document.getElementById("prepSubmitBtn").disabled = true;
    }else {
        // show next and hide submit
        document.getElementById("prepSubmitBtn").style.display = "none";
        document.getElementById("nextBtn").style.visibility = "visible"
        
      }  
}

