// Require Libraries
const mongoose = require('mongoose')

// Define user schema
const userSchema = new mongoose.Schema({
    role: { // 0 is a participant, 1 is a facilitiator
       type: Number,
       required: false 
    },
    name: {
        type: String,
        required: false
    },
    tableCode: {
        type: String,
        required: false
    },
    prepAnswers: {
        type: Array,
        required: false
    },
    plateSvg:  { 
        type: String, 
        required: false
    }
    // plateSvg:  { 
    //     data: Buffer, 
    //     contentType: String 
    // }
})

// Export user schema
module.exports = mongoose.model('User', userSchema)