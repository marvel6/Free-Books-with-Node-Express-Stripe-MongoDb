const customError = require('../error')
const { StatusCodes } = require('http-status-codes')
const cloudinary = require('../utils/cloudinary')
const File = require('../model/cloudinaryModel')
const fs = require('fs')
const {responses} = require('../Response/response')

const sendFile = async (req, res) => {
   

    const post = req.body.name

    if(req.files){
        const result = await cloudinary.uploader.upload(req.files.image.tempFilePath,{
            use_filename:true,
            folder:'E-books',
        })
        fs.unlinkSync(req.files.image.tempFilePath)
    
    const user = new File({
        name:post,
        avatar:result.secure_url,
        cloud_id:result.public_id,
        user:req.user.userId
    })

     await user.save()


     res.status(StatusCodes.OK).json(responses({msg:'File have been uploaded',data:user.avatar},))

    }
    
}


const getAllfile = async (req, res) => {

   
}


const getSingleFiles = async (req, res) => {

}


const updateSingleFile = async (req, res) => {

}


const deleteSingleFile = async (req, res) => {

}


module.exports = {
    sendFile,
    getAllfile,
    getSingleFiles,
    deleteSingleFile,
    updateSingleFile
}