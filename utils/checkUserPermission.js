const customError = require('../error')


const checkPermission = (requestId,userID) => {
    if(requestId.role === "admin") return
    if(requestId.userId === userID.toString()) return

    throw new customError.UnauthorizedError('You are not authorized to access this route')
}


module.exports = {checkPermission}