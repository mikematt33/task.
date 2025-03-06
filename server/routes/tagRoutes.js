const express = require('express');
const router = express.Router();
const tagController = require('../controllers/tagController');

router.get('/getTagsByID/:tagID', tagController.getTagsByID);
router.delete('/deleteTag/:tagID', tagController.deleteTag);
router.get('/getAllTagsByUserID/:userID', tagController.getAllTagsByUserID);
router.post('/createTag', tagController.createTag);

module.exports = router;