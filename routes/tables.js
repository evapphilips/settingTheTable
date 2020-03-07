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

// // Update the table with a new question
// router.get('/create_question/:id', getTable, (req, res) => {
//     res.status(201).json(res.table.joinQuestions)
//     // var update = [res.table.joinQuestions, re1.table.joinQuestions]
//     // router.patch()
//   })

// // Create a new join question entry
// router.post('/create_question', async (req, res) => {
//   const table = new Table({
//     ...req.body
//   })
//   try {
//     const newTable = await user.save()
//     // send a success message
//     res.status(201).json({message: "success"})
//     // res.status(201).json(newUser)
//   } catch (err) {
//     res.status(400).json({message: err.message})
//   }
// })

//   // Get one table
//   router.get('/:id', getTable, (req, res) => {
//     res.json(res.table)
//   })
  
//   // Create one table
//   router.post('/', async (req, res) => {
//       const table = new Table({
//           ...req.body
//         })
//         try {
//             const newTable = await table.save()
//             res.status(201).json(newTable)
//         } catch (err) {
//             res.status(400).json({ message: err.message })
//         }
//     })
    
// // Update one table
// router.patch('/:id', getTable, async (req, res) => {
//   if (req.body.joinQuestions != null) {
//     res.table.joinQuestions = req.body.joinQuestions
//   }
  
//   try {
//     const updatedTable = await res.table.save()
//     res.json(updatedTable)
//   } catch {
//     res.status(400).json({ message: err.message })
//   }
// })

// // Delete one table
// router.delete('/:id', getTable, async (req, res) => {
//   try {
//     await res.table.remove()
//     res.json({ message: 'Deleted This Table' })
//   } catch(err) {
//     res.status(500).json({ message: err.message })
//   }
// })

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