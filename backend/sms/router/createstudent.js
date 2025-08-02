// const express = require('express');
// const router = express.Router();
// const { createStudent } = require('../controller/createstudent');
// const authGuard = require('../middleware/authguard');
// const isAdmin = require('../middleware/isadmin');
// const fileUpload = require('../middleware/multer');    

// router.post('/createstudent', fileUpload("image") , createStudent); // 



const express = require('express');
const router = express.Router();
const { createStudent, getAllStudents, getStudentCount, getStudentsByClass } = require('../controller/createstudent');
const authGuard = require('../middleware/authguard');
const isAdmin = require('../middleware/isadmin');
// const fileUpload = require('../middleware/multer');

router.post('/createstudent', authGuard, isAdmin, createStudent);
router.get('/getallstudents', authGuard, isAdmin, getAllStudents);
router.get('/getstudentcount', authGuard, isAdmin, getStudentCount);
router.get('/getstudentcountforteachers', authGuard, getStudentCount); // Allow teachers to access
router.get('/getstudentsbyclass/:class', authGuard, getStudentsByClass); // Allow teachers to access

module.exports = router;
