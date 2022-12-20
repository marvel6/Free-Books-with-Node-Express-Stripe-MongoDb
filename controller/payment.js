const keys = require('../config/keys')
const stripe = require('stripe')(keys.SecretKey)


const paymentCharge = async(req,res) =>{
   const amount = 2500

    stripe.customers.create({
        email:req.body.stripeEmail,
        source:req.body.stripeToken
    })
    .then(customer => stripe.charges.create({
        amount,
        description:'web Development Course',
        currency:'usd',
        customer:customer.id

    }))
    .then(charge => res.render('success'))
}



module.exports = {paymentCharge}
