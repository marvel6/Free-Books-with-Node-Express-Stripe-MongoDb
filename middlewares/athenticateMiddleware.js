const {verifyJwtToken,attachCookiesToResponse} = require('../utils/index')
const customError = require('../error')
const Token = require('../model/tokenModel')


const AuthenticateUser = async(req,res,next) =>{
    const {accessToken,refreshToken} = req.signedCookies
try {
    
        if(accessToken){
            const payload = verifyJwtToken(accessToken)
            req.user = payload.user
            return next();
        }
    
    
        const payload = verifyJwtToken(refreshToken)
    
        const  tokenExist = await Token.findOne({
            user:payload.user.userId,
            refreshToken:payload.refreshToken
        })
    
        if(!tokenExist || !tokenExist?.isValid){
            throw new customError.UnauthenticatedError(` User not authenticated to access this site`)
        }
        
        attachCookiesToResponse({
            res,
            user:payload.user,
            refreshToken:tokenExist.refreshToken
        })
    
        req.user = payload.user
        next()
    
    } catch (error) {
        
        throw new customError.UnauthenticatedError(` User not authenticated to access this site`)
    }


}




const checkPermission = (...roles) =>{
   return (req,res,next) =>{
    if(!roles.includes(req.user.role)){
        throw new customError.UnauthenticatedError(`${req.user.name} not authenticated to access this site`)
    }
    next()
   }
}


module.exports = {
    AuthenticateUser,
    checkPermission
}
