const {StatusCodes} = require('http-status-codes')
const {responses} = require('../Response/response')



const ErrorhandlerAuth = (err,req,res,next) =>{

                let customError = {
                    statuscodes:err.statuscodes || StatusCodes.INTERNAL_SERVER_ERROR,
                    msg:err.message || "Looks like something went Wrong"
                }


                if(err.name === "ValidationError"){
                    customError.msg = Object.values(err.errors)
                    .map(item => item.message)
                    .join(",")

                    customError.statuscodes = 400
                }

                if(err.code && err.code === 11000){
                    customError.msg = `Duplicate Errors at ${Object.keys(err.KeyValue)} field, please use another value`

                    customError.statuscodes = 400
                }


                if(err.name === "CastError"){
                    customError.msg = `No user with Id ${err.values}`
                    customError.statuscodes = 404
                }


                res.status(customError.statuscodes).json(responses({msg:customError.msg}))


}



module.exports = ErrorhandlerAuth