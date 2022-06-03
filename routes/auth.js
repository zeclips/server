const express = require('express');
const router = express.Router();

const { register, login, forgotpassowrd, resetpassowrd } = require('../controllers/auth')

router.route("/register").post(register)

router.route("/login").post(login)

router.route("/forgotpassword").post(forgotpassowrd)

router.route("/resetpassword/:resetToken").put(resetpassowrd)

module.exports = router;