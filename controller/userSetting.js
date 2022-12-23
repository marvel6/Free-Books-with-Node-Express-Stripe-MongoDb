const {StatusCodes} = require('http-status-codes')
const customError = require('../error')
const User = require('../model/user')
const {responses} = require('../Response/response')




const changePasswordSetting = async(req,res) => {

        const {newPassword , oldPassword , retypeNewpassword} = req.body

        if(!newPassword && !oldPassword){
            throw new customError.BadRequestError('Please provide valid Credentials')
        }

        const user = await User.findOne({user:req.user.userId})

        if(!user){
            throw new customError.BadRequestError('Invalid Credentials')
        }

    

        const checkOldPassword = await user.compare(oldPassword)

    

            if(!checkOldPassword){
                throw new customError.BadRequestError('Invalid Credentials')
            }

            if(newPassword !== retypeNewpassword){
                throw new customError.BadRequestError('Passwords Incorrect please verify and retry')
            }

            user.password = newPassword

            user.save()
            
        

            res.status(StatusCodes.OK).json(responses({msg:'Password reset successful'}))

}


const changeNameAndEmail = async(req,res) =>{

        const {name,email} = req.body

        if(!name || !email) {
            throw new customError.BadRequestError('Please provid valid Credentials')
        }

        const user = await User.findOne({user:req.user.userId})

        if(!user){
            throw new customError.NotFoundError('User not found,please verify user')
        }

        user.name = name
        user.email = email

        user.save()

        res.status(StatusCodes.OK).json(responses({msg:`Name and email Updated successfully`}))


}






module.exports = {
    changePasswordSetting,
    changeNameAndEmail
}