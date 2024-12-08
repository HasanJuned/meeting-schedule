const express = require("express");
const router = express.Router();
const HostAuthController = require('../controllers/HostAuthController');
const GuestAuthController = require('../controllers/GuestAuthController');
const HostScheduleController = require('../controllers/HostScheduleController');
const HostDashBoardController = require('../controllers/HostDashBoardController');
const GuestScheduleController = require('../controllers/GuestScheduleController');
const HostAuthVerifyMiddleware=require("../middleware/HostAuthVerifyMiddleware");
const GuestAuthVerifyMiddleware=require("../middleware/GuestAuthVerifyMiddleware");
const TasksController = require('../controllers/TaskController')

router.post('/host/registration', HostAuthController.Registration)
router.post('/host/login', HostAuthController.Login)
router.post('/host/profile', HostAuthVerifyMiddleware, HostAuthController.Profile)

router.post('/host/createschedule', HostAuthVerifyMiddleware, HostScheduleController.createSchedule)
router.post('/host/edit/:scheduleId', HostAuthVerifyMiddleware, HostScheduleController.editSchedule)
router.get('/host/delete/:hostEmail/:scheduleId', HostAuthVerifyMiddleware, HostScheduleController.deleteSchedule)
router.get('/host/mostBooked/:hostEmail', HostAuthVerifyMiddleware, HostDashBoardController.mostBooked)
router.get('/host/popularBookingTime/:hostEmail', HostAuthVerifyMiddleware, HostDashBoardController.popularBookingTime)
router.get('/host/meetings/today/:hostEmail/:startDate', HostAuthVerifyMiddleware, HostDashBoardController.countTodaysMeetings);

// router.get('/ProfileDetails', HostAuthVerifyMiddleware, HostAuthController.ProfileDetails)
// router.post('/ProfileUpdate', HostAuthVerifyMiddleware, HostAuthController.ProfileUpdate)
// router.get("/RecoverVerifyEmail/:email",HostAuthController.RecoverVerifyEmail);
// router.get("/RecoverVerifyOTP/:email/:otp",HostAuthController.RecoverVerifyOtp);
// router.post("/RecoverResetPassword",HostAuthController.RecoverResetPassword);

/// guest
router.post('/guest/registration', GuestAuthController.Registration)
router.post('/guest/login', GuestAuthController.Login)
router.post('/guest/profile', GuestAuthVerifyMiddleware, GuestAuthController.Profile)


router.post('/guest/search', GuestScheduleController.searchSchedules)
router.get('/guest/schedules', GuestScheduleController.allSchedules)
router.get('/guest/bookschedule/:scheduleId/:email', GuestScheduleController.bookSchedule);



// router.post("/createTask",HostAuthVerifyMiddleware,TasksController.createTask);
// router.get("/deleteTask/:id",HostAuthVerifyMiddleware,TasksController.deleteTask);
// router.get("/updateTaskStatus/:id/:status",HostAuthVerifyMiddleware,TasksController.updateTaskStatus);
// router.get("/listTaskByStatus/:status",HostAuthVerifyMiddleware,TasksController.listTaskByStatus);
// router.get("/taskStatusCount",HostAuthVerifyMiddleware,TasksController.taskStatusCount);


module.exports = router;