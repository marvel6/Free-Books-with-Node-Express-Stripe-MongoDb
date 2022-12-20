const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')


const userSchema = new mongoose.Schema({
  name:{
    type:String,
    required:[true,'please provide name value']
  },
  email:{
    type:String,
    validate:{
          validator:validator.isEmail,
          message:'please provide a valid Email Address'
      }
  },
  matric:{
    type:String,
    required:[true,'please provide Matric Number']
  },
  password:{
    type:String,
    required:[true,'please provide password']
  },
  role:{
    type:String,
    enum:["admin","user"],
    default:"user"
  },
  verificationToken:String,
  isValidToken:{
    type:Boolean,
    default:false
  },
  isValid:Date

});



userSchema.pre('save', async function(){

   if(!this.isModified('password')) return;

  const salt = 10;
  this.password = await bcrypt.hash(this.password,salt)
})


userSchema.methods.compare =  async function(password){
  const verifyPassword = await bcrypt.compare(this.password,password)
  return verifyPassword
}


module.exports = mongoose.model('UserReg',userSchema)