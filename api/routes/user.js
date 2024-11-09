const express = require('express');
const {getUserDetails, saveGoogleUser} = require('../controllers/user');
const router = express.Router();

router.get('/', getUserDetails);
module.exports = router; 