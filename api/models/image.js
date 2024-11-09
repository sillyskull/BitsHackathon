const mongoose = require('mongoose');

const imageSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refs: "users"
    },
    uploaded_image_path: {
        type: String,
        required: true
    }
}, {timestamps: true});

const Image = mongoose.model('image', imageSchema);

module.exports = Image;