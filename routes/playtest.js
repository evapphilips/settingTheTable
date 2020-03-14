// Require libraries and files
const express = require('express')
const path = require('path');
const router = express.Router()

// Show Participants page
router.get('/', async (req, res) => {
    res.sendFile('playtest.html', { root: path.join(__dirname, '../public') });
  })

  module.exports = router