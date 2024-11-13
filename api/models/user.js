const mongoose = require('mongoose');

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
    role: {
        type: String,
        required: true,
        default: 'GENERAL'
    }
}, {timestamps: true}); // Auto-generate createdAt and updatedAt timestamps

User = mongoose.model('user', userSchema);

module.exports = User;
