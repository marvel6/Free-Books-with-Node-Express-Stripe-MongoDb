const express = require('express')
const router = express.Router()

const {registerUser,loginUser,log} = require('../controller/user')

const {AuthenticateUser} = require('../middlewares/athenticateMiddleware')


router.route('/register-user').post(registerUser)
router.route('/login-user').post(loginUser)
router.route('/logout').delete(AuthenticateUser,log)





module.exports = router