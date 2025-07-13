const express = require('express');
const router = express.Router();
const { register } = require('../controllers/authController');

// @route   POST /api/auth/register
// @desc    Đăng ký người dùng mới
// @access  Public

router.post ('/register', register);
module.exports = router;