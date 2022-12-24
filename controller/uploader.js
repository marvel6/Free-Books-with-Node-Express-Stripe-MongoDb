const customError = require('../error')
const { StatusCodes } = require('http-status-codes')
const cloudinary = require('../utils/cloudinary')
const File = require('../model/cloudinaryModel')
const fs = require('fs')
const { responses } = require('../Response/response')
const User = require('../model/user')
const { checkPermission } = require('../utils')


const sendFile = async (req, res) => {

    try {

        const result = await cloudinary.uploader.upload(req.file.path, {
            use_filename: true,
            folder: 'E-books'
        })

        const user = new File({
            cloud_id:result.public_id,
            name:req.body.name,
            level:req.body.level,
            avatar:result.secure_url,
            user:req.user.userId
        })

        await user.save()

        res.status(StatusCodes.OK).json(responses({ msg: 'File have been uploaded successfully' }))

    } catch (error) {
        console.log(error)

        res.status(StatusCodes.OK).json(responses({ msg: 'Looks like something went wrong', data: error.message }))
    }


}


const getAllfile = async (req, res) => {    //Uplaods
    const userFile = await File.find({})

    res.status(StatusCodes.OK).json(responses({ msg: userFile, data: userFile.length }))

}


const getSingleFiles = async (req, res) => {

    const { id: userId } = req.params

    const user = await File.findOne({ userId })

    if (!user) {
        throw new customError.NotFoundError("User not found , Invalid Credentials")
    }

    checkPermission(req.user, user.user)        //security level

    res.status(StatusCodes.OK).json(responses({ msg: 'User', data: user }))  // responses -< A well structured response


}





const updateSingleFile = async (req, res) => {

    try {
        let user = await File.findById(req.params.id)

        await cloudinary.uploader.destroy(user.cloud_id)
        
        const result = await cloudinary.uploader.upload(req.file.path,{
            use_filename: true,
            folder: 'E-books'
        })

        const data = {
            name:req.body.name,
            avatar:result.public_id,
            cloud_id:result.public_id,
            level:req.body.level
        }

        user = await File.findByIdAndUpdate(req.params.id, data , {new:true,runValidators:true})

        res.status(StatusCodes.OK).json(responses({msg:'Hurray your file have been updated successfully',data:user}))
        
    } catch (error) {
        res.status(StatusCodes.OK).json(responses({ msg: 'Looks like something went wrong', data: error.message }))
    }




}


const deleteSingleFile = async (req, res) => {

        try {
            let user = await File.findById(req.params.id)
        
            await cloudinary.uploader.destroy(user.cloud_id)
        
            await user.remove()
        
            res.status(StatusCodes.OK).json(responses({msg:'Hurray your file have been deleted',data:user}))
            
         } catch (error) {
            console.log(error)
           res.status(StatusCodes.BAD_REQUEST).json(responses({msg:'Looks like something went wrong'}))  
         }


}


module.exports = {
    sendFile,
    getAllfile,
    getSingleFiles,
    deleteSingleFile,
    updateSingleFile
}