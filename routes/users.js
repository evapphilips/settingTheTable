// Require libraries and files
const express = require('express')
const router = express.Router()

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

// Get one user
// router.get('/:id', (req, res) => {
// })
router.post('/', async (req, res) => {
    const user = new User({
        role: req.body.role,
        name: req.body.name,
        hasPrepared: req.body.hasPrepared
    })
    try {
      const newUser = await user.save()
      res.status(201).json(newUser)
    } catch (err) {
      res.status(400).json({ message: err.message })
    }
  })

// Create one user
router.post('/', (req, res) => {
})

// Update one user
router.patch('/:id', (req, res) => {
})

// Delete one user
router.delete('/:id', (req, res) => {
})

module.exports = router