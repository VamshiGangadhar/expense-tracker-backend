const express = require('express');
const userController = require('../controllers/userController');
const testController = require('../controllers/testController');
const router = express.Router();

router.get('/', testController.testGet);

module.exports = router;