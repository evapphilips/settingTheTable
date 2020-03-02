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
router.get('/:id', getUser, (req, res) => {
  res.json(res.user)
})

// Create one user
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

// Update one user
router.patch('/:id', getUser, async (req, res) => {
  if (req.body.role != null) {
    res.user.role = req.body.role
  }
  if (req.body.name != null) {
    res.user.name = req.body.name
  }
  if (req.body.hasPrepared != null) {
    res.user.hasPrepared = req.body.hasPrepared
  }
  try {
    const updatedUser = await res.user.save()
    res.json(updatedUser)
  } catch {
    res.status(400).json({ message: err.message })
  }
})

// Delete one user
router.delete('/:id', getUser, async (req, res) => {
  try {
    await res.user.remove()
    res.json({ message: 'Deleted This User' })
  } catch(err) {
    res.status(500).json({ message: err.message })
  }
})

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