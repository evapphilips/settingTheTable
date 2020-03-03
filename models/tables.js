// Require Libraries
const mongoose = require('mongoose')

// Define user schema
const tableSchema = new mongoose.Schema({
    tableCode: {
        type: String,
        required: true
    },
    prepQuestions: {
        type: Array,
        required: true,
        details: [{
            question1: String,
            question2: String
        }]   
    }      
})

// Export user schema
module.exports = mongoose.model('Table', tableSchema)