const mongoose = require('mongoose')


const userUploads = new mongoose.Schema({
    cloud_id:{type:String,required:true},
    name:{type:String,required:true},
    level:{type:String},
    avatar:{type:String,default:'/uploads'},
    user:{type:mongoose.Types.ObjectId,ref:'user',required:false}
})



module.exports = mongoose.model('User-uploads',userUploads)