
const mongoose = require('mongoose')

const tokenModel = mongoose.Schema({
    ip:{
        type:String,
        required:true
    },
    userAgent:{
        type:String,
        required:true
    },
    refreshToken:{
        type:String,
        required:true
    },
    user:{
        type:mongoose.Types.ObjectId,
        ref:'user',
        required:true
    },
    isValid:{
        type:Boolean,
        default:true
    }
},{timestamps:true})


module.exports = mongoose.model('Tokens',tokenModel)