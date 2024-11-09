const express = require('express');
const router = express.Router();
const {handleUploads}  = require("../controllers/dashboard");

router.post('/uploads', handleUploads);

module.exports = router;