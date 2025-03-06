const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/getUsers', userController.getUsers);
router.delete('/deleteUser/:userID', userController.deleteUser);
router.put('/updateSettings/:userID', userController.updateSettings);
router.get('/getUserSettings/:userID', userController.getUserSettings);

module.exports = router;