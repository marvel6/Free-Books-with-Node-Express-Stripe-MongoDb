const express = require('express')
const router = express.Router()


const {
    sendFile,
    getAllfile,
    getSingleFiles,
    updateSingleFile,
    deleteSingleFile
} = require('../controller/uploader')


    const {AuthenticateUser,checkPermission} = require('../middlewares/athenticateMiddleware')

    router.route('/').get(AuthenticateUser,getAllfile)

    router.route('/sendfile').post(AuthenticateUser,sendFile)

    router.route('/:id').get(AuthenticateUser,getSingleFiles)

    router.route('/:id').patch(AuthenticateUser,updateSingleFile)
    router.route('/:id').delete(AuthenticateUser,checkPermission,deleteSingleFile)


    module.exports = router