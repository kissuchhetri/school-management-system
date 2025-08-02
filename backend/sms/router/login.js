const express = require('express');
const router = express.Router(); // ✅ Create a router instance
const { loginUser } = require('../controller/login');
const authGuard = require('../middleware/authguard');

router.post('/login', loginUser); // ✅ Use router, not express
module.exports = router;    