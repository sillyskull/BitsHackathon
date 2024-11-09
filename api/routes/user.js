const express = require('express');
const {getUserDetails, uploadImage} = require('../controllers/user');
const router = express.Router();

router.get('/', getUserDetails);


module.exports = router; 