const multer = require('multer')
const path = require('path')



module.exports = multer({

    storage: multer.diskStorage({}),
    fileFilter: (req, file, cb) => {
        let ext = path.extname(file.originalname);

        if (ext !== ".png" && ext !== ".jpg" && ext !== ".jpeg" && ext !== ".pdf") {
            cb(new Error("File is not support"), false);
            return;
        }

        cb(null, true);
    }

})