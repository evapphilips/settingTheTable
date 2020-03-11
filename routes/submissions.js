// Require libraries and files
const express = require('express')
const router = express.Router()

const Submission = require('../models/submissions')

// Get all submissions
router.get('/', async (req, res) => {
    try {
      const submissions = await Submission.find()
      res.json(submissions)
    } catch (err) {
      res.status(500).json({ message: err.message })
    }
  })

// Create a new submission question
router.post('/create', async (req, res) => {
  const submission = new Submission({
    ...req.body
  })
  try {
    const newSubmission = await submission.save()
    // send back id message
    res.status(201).json(newSubmission._id)
  } catch (err) {
    res.status(400).json({message: err.message})
  }
})

// Get all submission for a particular table
router.get('/:code', async (req, res) => {
  try {
    Submission.find({"tableCode": req.params.code}, (err, doc) => {
      // if none exist yet
      if(doc.length === 0){
        res.json({message: "empty"})  // empty if there are no submissions for the table
      }else{
        // if some exist
        res.json({message: "success", submissions: doc}) // success if there are some submissions for the table
      } 
    }).catch(err => {
      return err
    })
  } catch(err) {
    res.status(500).json({ message: err.message })
  }
})

// Get one submission for a particular table
router.get('/find/:id', getSubmission, (req, res) => {
  res.json(res.submission)
})


//////////////// Helper Functions /////////////////////
// access specific submission
async function getSubmission(req, res, next) {
    try {
      submission = await Submission.findById(req.params.id)
      if (submission == null) {
        return res.status(404).json({ message: 'Cant find submission'})
      }
    } catch(err){
      return res.status(500).json({ message: err.message })
    }
  
    res.submission = submission
    next()
  }
  
  module.exports = router




  // TO DELETE LATER
  // // Delete one user
router.delete('/:id', getSubmission, async (req, res) => {
  try {
    await res.submission.remove()
    res.json({ message: 'Deleted This submission' })
  } catch(err) {
    res.status(500).json({ message: err.message })
  }
})