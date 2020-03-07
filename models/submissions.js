// Require Libraries
const mongoose = require('mongoose')

// Define user schema
const submissionSchema = new mongoose.Schema({
    tableCode: {
        type: String,
        required: false
    },
    question: {
        type: Array,
        required: false
    }
})

// Export user schema
module.exports = mongoose.model('Submission', submissionSchema)