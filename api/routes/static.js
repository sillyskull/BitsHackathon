const express = require('express');

const {handleLogin, handleSignUp} = require('../controllers/user');

const router = express.Router();

router.post('/login', handleLogin);
router.post('/signup', handleSignUp);

module.exports = router;