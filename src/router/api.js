// all router setup
const express = require('express');
const { Registration, UpdateProfile, Login } = require('../controller/UserController');
const AuthVerifyMiddleware = require('../middleware/AuthVerifyMiddleware');
const { CreateTask, ReadTasks, UpdateStatus, SelectTasksByStatus, TaskStatusCount } = require('../controller/TasksController');

const router = express.Router();
// Profile Section
// registration
router.post("/registration", Registration);
// login
router.post("/login", AuthVerifyMiddleware, Login)
// update Profile
router.post("/updateProfile", AuthVerifyMiddleware, UpdateProfile)

// Task Section 
// create Task
router.post("/createTask", AuthVerifyMiddleware, CreateTask);
// Read Tasks
router.get("/readTasks", ReadTasks);
// update Status
router.get("/updateStatus/:id/:status", AuthVerifyMiddleware, UpdateStatus);
router.get("/SelectTasksByStatus/:status", AuthVerifyMiddleware, SelectTasksByStatus);
router.get("/taskStatusCount", AuthVerifyMiddleware, TaskStatusCount);



module.exports = router;