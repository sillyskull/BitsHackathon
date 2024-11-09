const mongoose = require('mongoose');

// Define user schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role:{
        type: String,
        required: true,
        default: 'GENERAL'
    }
}, {timestamps: true}); // Auto-generate createdAt and updatedAt timestamps

// Export the user model
User = mongoose.model('user', userSchema);

module.exports = User;
