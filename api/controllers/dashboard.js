const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const MedicalData = require('../models/image'); 

async function handleUploads(req, res) {
    try {
        const fetch = (await import('node-fetch')).default;

        const {
            fullName,
            age,
            gender,
            premedicalConditions,
            testType,
            image,
        } = req.body;

        if (!fullName || !age || !gender || !testType) {
            return res.status(400).json({ error: 'Missing required medical information: fullName, age, gender, or testType' });
        }

        if (!image || !image.startsWith('data:image')) {
            return res.status(400).json({ error: 'Invalid or missing image data' });
        }

        const matches = image.match(/^data:(image\/\w+);base64,(.+)$/);
        if (!matches) {
            return res.status(400).json({ error: 'Invalid image format' });
        }

        const ext = matches[1].split('/')[1];
        const imageData = matches[2];
        const buffer = Buffer.from(imageData, 'base64');

        const userUploadDir = path.join(__dirname, '../useruploads');
        await fs.mkdir(userUploadDir, { recursive: true });

        const uniqueName = `${uuidv4()}.${ext}`;
        const imagePath = path.join(userUploadDir, uniqueName);

        await fs.writeFile(imagePath, buffer);


        const newMedicalData = new MedicalData({
            fullName,
            age,
            gender,
            premedicalConditions,
            testType,
            uploaded_image_path: imagePath, 
        });

        await newMedicalData.save();

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
                imagePath, 
            }),
        });

        if (!response.ok) {
            throw new Error(`Flask API error: ${response.statusText}`);
        }

        const flaskResponse = await response.json();

        return res.json({
            msg: "Successfully received and stored medical data along with the image",
            file: imagePath,
            flaskResponse, 
        });

    } catch (error) {
        console.error('Error processing upload:', error);
        return res.status(500).json({ error: 'Error processing upload' });
    }
}

module.exports = {
    handleUploads
};
