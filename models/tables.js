// Require Libraries
const mongoose = require('mongoose')

// Define user schema
const tableSchema = new mongoose.Schema({
    tableCode: {
        type: String,
        required: true
    },
    prepQuestion1: {
        type: String,
        required: true
    },
    prepQuestion2: {
        type: String,
        required: true
    },
    prepQuestion3: {
        type: String,
        required: true
    },
    
})

// Export user schema
module.exports = mongoose.model('Table', tableSchema)