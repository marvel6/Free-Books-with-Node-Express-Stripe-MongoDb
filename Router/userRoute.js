const express = require('express')
const router = express.Router()

const {registerUser,loginUser} = require('../controller/user')


router.route('/register-user').post(registerUser)
router.route('/login-user').post(loginUser)





module.exports = router