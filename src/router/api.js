// all router setup
const express = require('express');
const { Registration, UpdateProfile, Login, getProfileDetails, RecoverEmail, VerifyOTP, ResetPassword } = require('../controller/UserController');
const AuthVerifyMiddleware = require('../middleware/AuthVerifyMiddleware');
const { CreateTask, ReadTasks, UpdateStatus, SelectTasksByStatus, TaskStatusCount, DeleteTask } = require('../controller/TasksController');

const router = express.Router();
// Profile Section
// registration
router.post("/registration", Registration);
// login
router.post("/login", Login)
// update Profile
router.post("/updateProfile", AuthVerifyMiddleware, UpdateProfile)
// get profile details
router.get('/profileDetails', AuthVerifyMiddleware, getProfileDetails)
//recover verify email
router.get("/recoverEmail/:email", RecoverEmail)
// otp verify
router.get("/verifyOTP/:email/:otp", VerifyOTP)
// reset password
router.post("/ResetPassword", ResetPassword)

// Task Section 
// create Task
router.post("/createTask", AuthVerifyMiddleware, CreateTask);
// Read Tasks
router.get("/readTasks", ReadTasks);
// delete task
router.delete("/deleteTask/:id", AuthVerifyMiddleware, DeleteTask)
// update Status
router.get("/updateStatus/:id/:status", AuthVerifyMiddleware, UpdateStatus);
// task filter by status
router.get("/SelectTasksByStatus/:status", AuthVerifyMiddleware, SelectTasksByStatus);
// task summary
router.get("/taskStatusCount", AuthVerifyMiddleware, TaskStatusCount);



module.exports = router;