// Require Libraries
const mongoose = require('mongoose')

// Define user schema
const userSchema = new mongoose.Schema({
    role: { // 0 is a participant, 1 is a facilitiator
       type: Number,
       required: true 
    },
    name: {
        type: String,
        required: true
    },
    hasPrepared: {
        type: Boolean,
        required: true,
        default: false,
    }
})

// Export user schema
module.exports = mongoose.model('User', userSchema)