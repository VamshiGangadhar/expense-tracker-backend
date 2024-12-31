const express = require('express');
const testController = require('../controllers/testController');
const router = express.Router();

router.get('/', testController.testGet);

module.exports = router;