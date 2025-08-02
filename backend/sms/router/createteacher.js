const express = require('express');
const router = express.Router();
const {  createTeacher, getAllTeachers,getTeacherCount } = require('../controller/createteacher');
const authGuard = require('../middleware/authguard');
const isAdmin = require('../middleware/isadmin');
const fileUpload = require('../middleware/multer');
// const fileUpload = require('../middleware/multer');

router.post('/createteacher', authGuard, isAdmin,fileUpload("photo"),createTeacher);
router.get('/getallteachers', authGuard, isAdmin, getAllTeachers); // Get all teachers (admin)
router.get('/getteachercount', authGuard, isAdmin, getTeacherCount); // Get teacher count (admin)

module.exports = router;