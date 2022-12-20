const jwt = require('jsonwebtoken')

const creatJWT = ({payload}) =>{
    const token = jwt.sign(payload,process.env.JWT_SECRET)
    return token
}

const verifyJwtToken = (token) => jwt.verify(token,process.env.JWT_SECRET)


const attachCookiesToResponse = ({res,user,refreshToken}) =>{
    const accessTokenJWT = creatJWT({payload:{user}})
    const refreshTokenJWT = creatJWT({payload:{user,refreshToken}})


    const oneDay = 1000 * 60 * 60 * 24
    const longerExpiration = 1000 * 60 * 60 * 24 * 30


    res.cookie('acessToken',accessTokenJWT,{
        httpOnly:true,
        secure:process.env.NODE_ENV === 'production',
        expires:new Date(Date.now() + oneDay),
        signed:true
    })


    res.cookie('refreshToken',refreshTokenJWT,{
        httpOnly:true,
        secure:process.env.NODE_ENV === 'production',
        signed:true,
        expires:new Date(Date.now() + longerExpiration)
    })

    
}


module.exports = {
    verifyJwtToken,
    attachCookiesToResponse
}