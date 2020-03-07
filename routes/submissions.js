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