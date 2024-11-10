const Image = require('../models/image');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/user');
const MedicalData = require('../models/image'); // Ensure this is the correct model

async function handleUploads(req, res) {
    try {
        // Dynamically import node-fetch
        const fetch = (await import('node-fetch')).default;

        // Parse incoming JSON body
        const {
            fullName,
            age,
            gender,
            premedicalConditions,
            testType,
            image,
            user: userData,
        } = req.body;

        if (!userData || !userData._id) {
            return res.status(400).json({ error: 'User data is missing' });
        }

        const user = await User.findById(userData._id);

        if (!user || !user.username) {
            return res.status(400).json({ error: 'User not found or username missing' });
        }

        // Validate required fields
        if (!fullName || !age || !gender || !testType) {
            return res.status(400).json({ error: 'Missing required medical information: fullName, age, gender, or testType' });
        }

        // Check if the image is provided and in base64 format
        if (!image || !image.startsWith('data:image')) {
            return res.status(400).json({ error: 'Invalid or missing image data' });
        }

        // Decode the base64 image
        const matches = image.match(/^data:(image\/\w+);base64,(.+)$/);
        if (!matches) {
            return res.status(400).json({ error: 'Invalid image format' });
        }

        const ext = matches[1].split('/')[1];
        const imageData = matches[2];
        const buffer = Buffer.from(imageData, 'base64');

        // Define user upload directory
        const userUploadDir = path.join(__dirname, '../useruploads', user.username);
        await fs.mkdir(userUploadDir, { recursive: true });

        // Generate a unique filename for the image
        const uniqueName = `${uuidv4()}.${ext}`;
        const imagePath = path.join(userUploadDir, uniqueName);

        // Save the image to the filesystem
        await fs.writeFile(imagePath, buffer);

        // Create new medical data entry
        const newMedicalData = new MedicalData({
            user: user._id,
            fullName,
            age,
            gender,
            premedicalConditions,
            testType,
            uploaded_image_path: imagePath, 
        });

        await newMedicalData.save();

        // Send the data to the Flask API
        const response = await fetch('http://localhost:5000/api/upload', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                fullName,
                age,
                gender,
                premedicalConditions,
                testType,
                imagePath, // Send the image path
                userId: user._id,
            }),
        });

        if (!response.ok) {
            throw new Error(`Flask API error: ${response.statusText}`);
        }

        const flaskResponse = await response.json();

        return res.json({
            msg: "Successfully received and stored medical data along with the image",
            file: imagePath,
            flaskResponse, // Include the Flask API response in your final output
        });

    } catch (error) {
        console.error('Error processing upload:', error);
        return res.status(500).json({ error: 'Error processing upload' });
    }
}

module.exports = {
    handleUploads
};
