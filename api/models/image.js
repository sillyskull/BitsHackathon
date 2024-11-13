const mongoose = require('mongoose');

const medicalDataSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    premedicalConditions: { type: String, default: '' },
    testType: { type: String, required: true },
    uploaded_image_path: { type: String, required: true }, // path to the uploaded image
}, { timestamps: true });

module.exports = mongoose.model('MedicalData', medicalDataSchema);
