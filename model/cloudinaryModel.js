const mongoose = require('mongoose')


const userUploads = new mongoose.Schema({
    cloud_id:{type:String,required:true},
    name:{type:String,required:true},
    avatar:{type:String,default:'/uploads'},
    user:{type:mongoose.Types.ObjectId,ref:'user',required:true}
})



module.exports = mongoose.model('User-uploads',userUploads)