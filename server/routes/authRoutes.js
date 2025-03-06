const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/loginCheck', authController.loginCheck);
router.post('/registerUser', authController.registerUser);
router.put('/updatePassword', authController.updatePassword);
router.put('/updateEmail', authController.updateEmail);

module.exports = router;