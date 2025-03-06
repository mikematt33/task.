const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

router.get('/getCalendarEvents', taskController.getCalendarEvents);
router.get('/getAllTasksByID/:userID', taskController.getAllTasksByID);
router.get('/getTasksByUserID/:userID', taskController.getTasksByUserID);
router.get('/getTaskByTaskID/:taskID', taskController.getTaskByTaskID);
router.put('/updateTaskByTaskID/:taskID', taskController.updateTaskByTaskID);
router.delete('/deleteTask/:taskID', taskController.deleteTask);
router.delete('/deleteAllTasks/:taskID', taskController.deleteAllTasks);
router.post('/createTask', taskController.createTask);
router.post('/createEvent', taskController.createEvent);
router.put('/updateTaskDateByTaskID/:taskID', taskController.updateTaskDateByTaskID);
router.put('/updateTaskTagsByTaskID/:taskID', taskController.updateTaskTagsByTaskID);
router.put('/completeTaskByTaskID/:taskID', taskController.completeTaskByTaskID);
router.put('/unCompleteTaskByTaskID/:taskID', taskController.unCompleteTaskByTaskID);

module.exports = router;