const customError = require('../error')
const { StatusCodes } = require('http-status-codes')
const cloudinary = require('../utils/cloudinary')
const File = require('../model/cloudinaryModel')
const fs = require('fs')
const { responses } = require('../Response/response')
const User = require('../model/user')
const {checkPermission} = require('../utils')


const sendFile = async (req, res) => {


        let post = req.body.name
        let Doclevel = req.body.level

        if (req.files) {

            try {
                const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
                    use_filename: true,
                    folder: 'E-books',
                })


                fs.unlinkSync(req.files.image.tempFilePath)    // remove fromm temp file

                const user = new File({
                    name: post,
                    avatar: result.secure_url,
                    cloud_id: result.public_id,
                    user: req.user.userId,
                    level:Doclevel
                })

                await user.save()


                res.status(StatusCodes.CREATED).json(responses({ msg: 'File have been uploaded', data: user.avatar },))

            } catch (error) {

                res.status(StatusCodes.BAD_REQUEST).json(responses({ msg: 'Looks like something went wrong', data: error.message }))
            }



        }

}


const getAllfile = async (req, res) => {    //Uplaods
    const userFile = await File.find({}).sort("level")

    res.status(StatusCodes.OK).json(responses({ msg: userFile, data: userFile.length }))

}


const getSingleFiles = async (req, res) => {

            const { id: userId } = req.params

            const user = await File.findOne({ userId })

            if(!user){
                throw new customError.NotFoundError("User not found , Invalid Credentials")
            }

            checkPermission(req.user,user.user)        //security level

            res.status(StatusCodes.OK).json(responses({ msg: 'User', data: user }))  // responses -< A well structured response


        }



const updateSingleFile = async (req, res) => {

    if (req.files) {

        try {
            const { id: userId } = req.params

            let user = await File.findOne({ _id: userId })

            if (!user) {
                throw new customError.NotFoundError("User not found , Invalid Credentials")

            }

            await cloudinary.uploader.destroy(user.cloud_id)
            const uploaded = await cloudinary.uploader.upload(req.files.image.tempFilePath)

            const data = {                        //instance of a class db object
                name: req.body.name || user.name,
                cloud_id: uploaded.cloud_id,
                avatar: uploaded.secure_url
            }

            user = await File.findByIdAndUpdate(req.params.id, data, { new: true })

            res.status(StatusCodes.OK).json(responses({ msg: 'Hurray Your file have been updated' }))

        } catch (error) {
            res.status(StatusCodes.BAD_REQUEST).json(responses({ msg: 'Looks like something went wrong', data: error.message }))
        }
    }
}


const deleteSingleFile = async (req, res) => {
    const {id:userId} = req.params

    if(req.files){
        try{
            const user = await File.findOne({_id:userId})

            await cloudinary.uploader.destroy(user.cloud_id)  //remove from cloudinary CDN 

            if(!user){
                throw new customError.NotFoundError(`${user.name} is not found, please checck and retry again`)
            }

            user.remove()

            res.status(StatusCodes.OK).json(responses({msg:'File have been deleted !'}))

        }catch(error){

           res.status(StatusCodes.BAD_REQUEST).json(responses({msg:'looks like something went wrong',data:error.message}))
        }
    }


}


module.exports = {
    sendFile,
    getAllfile,
    getSingleFiles,
    deleteSingleFile,
    updateSingleFile
}