// Require libraries and files
const express = require('express')
const router = express.Router()

const Table = require('../models/tables')

// Get all tables
router.get('/', async (req, res) => {
    try {
      const tables = await Table.find()
      res.json(tables)
    } catch (err) {
      res.status(500).json({ message: err.message })
    }
  })

// Check if a table already exists
router.get('/check/:code', (req, res) => {
  try {
    const table = Table.findOne({"tableCode": req.params.code}, (err, doc) => {
      // if doesn't exist yet
      if(!doc){
        res.json({message: "failure"})  // failure if the table does not exist
      }else{{
        // if does exist
        res.json({message: "success", doc}) // success if the table does exist
      }}   
    }).catch(err => {
      return err
    })
    // res.json(user)
  } catch(err) {
    res.status(500).json({ message: err.message })
  }
})

//////////////// Helper Functions /////////////////////
// access specific table
async function getTable(req, res, next) {
    try {
      table = await Table.findById(req.params.id)
      if (table == null) {
        return res.status(404).json({ message: 'Cant find table'})
      }
    } catch(err){
      return res.status(500).json({ message: err.message })
    }
  
    res.table = table
    next()
  }
  
  module.exports = router



//   // TO DELETE LATER
//   // Create one table
// router.post('/', async (req, res) => {
//   const table = new Table({
//     ...req.body
//   })
//   try {
//     const newTable = await table.save()
//     // send a success message
//     res.status(201).json({message: "success"})
//   } catch (err) {
//     res.status(400).json({message: err.message})
//   }
// })

// // delete one table
// router.delete('/:id', getTable, async (req, res) => {
//   try {
//     await res.table.remove()
//     res.json({ message: 'Deleted This Table' })
//   } catch(err) {
//     res.status(500).json({ message: err.message })
//   }
// })