const express = require('express')
const router = express.Router()
const upload = require('../utils/multer')


const {
    sendFile,
    getAllfile,
    getSingleFiles,
    updateSingleFile,
    deleteSingleFile
} = require('../controller/uploader')


const { AuthenticateUser, checkPermission } = require('../middlewares/athenticateMiddleware')  //middlewares

router.route('/').get(AuthenticateUser, getAllfile)

router.route('/sendfile').post(AuthenticateUser, upload.single("image"), sendFile)

router.route('/:id').get(AuthenticateUser, getSingleFiles)

router.route('/:id').patch(AuthenticateUser, updateSingleFile)

router.route('/:id').delete([AuthenticateUser, checkPermission("admin")], deleteSingleFile)


module.exports = router