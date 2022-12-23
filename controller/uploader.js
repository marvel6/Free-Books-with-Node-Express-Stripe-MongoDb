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

        const user = await File.findOne({ user: req.user.userId }).exec()

        user.cloud_id = result.public_id
        user.name = req.body.name
        user.level = req.body.level
        user.avatar = result.secure_url
        user.user = req.user.userId


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