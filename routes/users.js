// Require libraries
const express = require('express')
const router = express.Router()

// Require files
const User = require('../models/users')

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find()
    res.json(users)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Check if a username already exists
router.get('/check/:name', (req, res) => {
  try {
    const user = User.findOne({"name": req.params.name}, (err, doc) => {
      // if doesn't exist yet
      if(!doc){
        res.json({message: "success"})  // success if the name is free
      }else{{
        // if does exist
        res.json({message: "failure"}) // failure if the name is not free
      }}   
    }).catch(err => {
      return err
    })
  } catch(err) {
    res.status(500).json({ message: err.message })
  }
})

// Create a new participant
router.post('/create', async (req, res) => {
  const user = new User({
    ...req.body
  })
  try {
    const newUser = await user.save()
    // send a success message
    res.status(201).json({message: "success"})
  } catch (err) {
    res.status(400).json({message: err.message})
  }
})

// Find a specific user by name and code
router.get('/find/:name/:code', (req, res) => {
  try {
    const user = User.findOne({"name": req.params.name, "tableCode": req.params.code}, (err, doc) => {
      if(!doc){
        res.json({message: "failure"})  // failure if that user/tableCode combination does not exist
      }else{
        res.json({message: "success", info: doc})  // success if that user/tableCode combination does exist
      }
    }).catch(err => {
      return err
    })
  } catch(err) {
    res.status(500).json({ message: err.message })
  }
})

// Find a specific user by _id
router.get('/find/:id', (req, res) => {
  try{
    const user = User.findOne({"_id": req.params.id}, (err, doc) => {
      if(!doc){
        res.json({message: "failure"}) // failure if that user _id does not exist
      }else {
        res.json({message: "success", src: doc.plateSvg}) // success if that user _id does exist
      }
    }).catch(err => {
      return err
    })
  } catch(err){
    res.status(500).json({ message: err.message })
  }
})

//////////////// Helper Functions /////////////////////
// access specific user
async function getUser(req, res, next) {
  try {
    user = await User.findById(req.params.id)
    if (user == null) {
      return res.status(404).json({ message: 'Cant find user'})
    }
  } catch(err){
    return res.status(500).json({ message: err.message })
  }

  res.user = user
  next()
}

module.exports = router







// FROM ORIGINAL CODE, TO DELETE LATER
// // Get one user
// router.get('/:id', getUser, (req, res) => {
//   res.json(res.user)
// })

// // Create one user
// router.post('/', async (req, res) => {
//   const user = new User({
//     role: req.body.role,
//     name: req.body.name,
//     tableCode: req.body.tableCode
//   })
//   try {
//     const newUser = await user.save()
//     // res.status(201).json(newUser)
//   } catch (err) {
//     res.status(400).json({ message: err.message })
//   }
// })

// // Update one user
// router.patch('/:id', getUser, async (req, res) => {
//   if (req.body.role != null) {
//     res.user.role = req.body.role
//   }
//   if (req.body.name != null) {
//     res.user.name = req.body.name
//   }
//   if (req.body.tableCode != null) {
//     res.user.tableCode = req.body.tableCode
//   }
//   try {
//     const updatedUser = await res.user.save()
//     res.json(updatedUser)
//   } catch {
//     res.status(400).json({ message: err.message })
//   }
// })

// // Delete one user
// router.delete('/:id', getUser, async (req, res) => {
//   try {
//     await res.user.remove()
//     res.json({ message: 'Deleted This User' })
//   } catch(err) {
//     res.status(500).json({ message: err.message })
//   }
// })