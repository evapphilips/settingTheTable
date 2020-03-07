// Require Libraries
const mongoose = require('mongoose')

// Define user schema
const tableSchema = new mongoose.Schema({
    tableCode: {
        type: String,
        required: false
    },
    prepQuestion1: {
        type: String,
        required: false
    },
    prepQuestion2: {
        type: String,
        required: false
    },
    prepQuestion3: {
        type: String,
        required: false
    },
    prepQuestion4: {
        type: String,
        required: false
    },
    prepQuestion5: {
        type: String,
        required: false
    },
    prepQuestion6: {
        type: String,
        required: false
    },
    prepQuestion7: {
        type: String,
        required: false
    }
})

// Export user schema
module.exports = mongoose.model('Table', tableSchema)