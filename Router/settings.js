const express = require('express')
const router = express.Router()

const {changePasswordSetting,changeNameAndEmail} = require('../controller/userSetting')
const {AuthenticateUser} = require('../middlewares/athenticateMiddleware')


router.route('/setting').post(AuthenticateUser,changePasswordSetting)
router.route('/settings').post(AuthenticateUser,changeNameAndEmail)



module.exports = router