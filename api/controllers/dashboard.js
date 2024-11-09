const Image = require('../models/image'); 
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid'); // Import the uuid library
const User = require('../models/user');

// Configure multer storage
const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        try {
            // Ensure user data exists in the request
            if (!req.body.user) {
                return cb(new Error('User data is missing'), null);
            }

            // Parse user data from the request
            const userData = JSON.parse(req.body.user);
            const user = await User.findById(userData._id); // Fetch user from database to get the username
            
            if (!user || !user.username) {
                return cb(new Error('User not found or username missing'), null);
            }

            // Define path with username as folder name
            const userUploadDir = path.join(__dirname, '../useruploads', user.username);

            // Create directory if it doesn't exist
            fs.mkdirSync(userUploadDir, { recursive: true });

            cb(null, userUploadDir); // Set the destination to the user-specific folder
        } catch (err) {
            cb(err, null); // Handle any errors during the directory creation
        }
    },
    filename: (req, file, cb) => {
        // Generate a unique name using UUID
        const uniqueName = `${uuidv4()}-${file.originalname}`;
        cb(null, uniqueName);
    }
});

// Initialize multer upload
const upload = multer({ storage: storage }).single('file');

// Upload handler function
function handleUploads(req, res) {
    upload(req, res, (err) => {
        if (err) {
            return res.status(500).json({ error: 'Error uploading the file' });
        }
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        console.log('Uploaded file:', req.file);

        let userData;
        if (req.body.user) {
            try {
                userData = JSON.parse(req.body.user); // Parse the user data
                console.log('User data:', userData);
            } catch (err) {
                console.error('Error parsing user data:', err);
                return res.status(400).json({ error: 'Invalid user data' });
            }
        } else {
            return res.status(400).json({ error: 'User data is missing' });
        }

        const newImage = new Image({
            user: userData._id,
            uploaded_image_path: req.file.path, 
        });

        newImage.save()
            .then(() => {
                return res.json({ 
                    msg: "Successfully received and stored image", 
                    file: req.file 
                });
            })
            .catch((error) => {
                console.error('Error saving image to the database:', error);
                return res.status(500).json({ error: 'Error saving image metadata' });
            });
    });
}

module.exports = {
    handleUploads
};