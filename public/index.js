// // Get all the database entries
// // get access to get all button
// var getAllButton = document.getElementById('getAllButton')
// // when button clicked
// getAllButton.addEventListener('click', function () {
//     fetch('/user').then(result => {
//         return result.json();
//     }).then(result => {
//         console.log(result)
//     }).catch(err => {
//         return err;
//     })
// })

// // Post to database
// // get acces to post button
// var postNew = document.getElementById('postNew')
// // when button clicked
// postNew.addEventListener('click', function () {
//     const newEntry = {
//         name: "new entry name",
//         role: 0,
//         hasPrepared: false
//     }

//     const options ={
//         method: "POST",
//         redirect: "follow",
//         headers: {
//             "Content-Type": "application/json",
//         },
//             body:JSON.stringify(newEntry)
//         }

//     fetch('/user', options).then(result => {
//         return result.json()
//     }).then(result => {
//         console.log(result)
//     }).catch(err => {
//         return err
//     })
// })


//         //  * POST hellos to the database
//             //  */
//             // function addHelloBtn(e){
//             //     console.log('clicked!')
//             //     const message = {message:"hello"}
                
//             //     const options ={
//             //         method: "POST",
//             //         redirect: "follow",
//             //         headers: {
//             //             "Content-Type": "application/json",
//             //         },
//             //         body:JSON.stringify(message)
//             //     }
                
//             //     fetch('/api', options).then(result => {
//             //         return result.json()
//             //     }).then(result => {
//             //         console.log(result)
//             //         // hellos.push(result);
//             //         // $counter.innerHTML = `${hellos.length} Hellos in the DB`
//             //         getHellos();
//             //         // window.location = "/"
//             //     }).catch(err =>{
//             //         return err
//             //     })
//             // }
