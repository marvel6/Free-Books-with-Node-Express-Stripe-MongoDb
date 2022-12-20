const express = require('express')
const router = express.Router()

const {paymentCharge} = require('../controller/payment')


router.route('/charge').post(paymentCharge)





module.exports = router