const { StatusCodes } = require('http-status-codes')
const customError = require('../error')
const User = require('../model/user')
const crypto = require('crypto')
const { responses } = require('../Response/response')
const { createUser, attachCookiesToResponse } = require('../utils')
const tokenModel = require('../model/tokenModel')



                const registerUser = async (req, res) => {
                    const { name, matric, email, password } = req.body

                    if (!name || !matric || !email || !password) {
                        throw new customError.BadRequestError('Please provide valid credentials')
                    }

                    const user = await User.findOne({ email })

                    if (user) {
                        throw new customError.BadRequestError('User already Exist, please login or register using different Email')
                    }


                    const firstUserIsAdmin = (await User.countDocuments({})) === 0
                    const role = firstUserIsAdmin ? "admin" : "user"

                    const users = await User.create({ name, matric, email, password, role })


                    res.status(StatusCodes.CREATED).json(responses({ msg: `Hello ,${name} you have been registered successfully` }))

                }


                const loginUser = async (req, res) => {

                    const { matric, password } = req.body

                    if (!matric || !password) {
                        throw new customError.BadRequestError('please provide valid Credentials')
                    }

                    const user = await User.findOne({ matric })

                    if (!user) {
                        throw new customError.NotFoundError('User not Registered , Please register')
                    }

                    const isPasswordValid = await user.compare(password)

                    if (!isPasswordValid) {
                        throw new customError.NotFoundError('Please provide valid matric number and password')
                    }

                    const tokenUser = createUser(user)

                    let refreshTokens = ''

                    refreshTokens = crypto.randomBytes(35).toString('hex')



                    const checkTokenModel = await tokenModel.findOne({ user: user._id })

                    if (checkTokenModel) {
                        const { isValid } = checkTokenModel

                        if (!isValid) {
                            throw new customError.UnauthenticatedError('Invalid Authentication')
                        }
                        refreshTokens = checkTokenModel.refreshToken
                        attachCookiesToResponse({ res, user: tokenUser, refreshToken: refreshTokens })
                        res.status(StatusCodes.OK).json(responses({ msg: 'Welcome, you logged in', data: tokenUser }))
                        return;
                    }


                    const ip = req.ip
                    const userAgent = req.headers['user-agent']

                    const tokenContent = { ip, userAgent, refreshToken: refreshTokens, user: user._id }

                    await tokenModel.create(tokenContent)

                    attachCookiesToResponse({ res, user: tokenUser, refreshToken: refreshTokens })

                    res.status(StatusCodes.OK).json(responses({ msg: 'Welcome, you logged in', data: tokenUser }))
                }


                const log = async (req, res) => {
                    
                    await tokenModel.findOneAndDelete({ user: req.user.userId })

                    res.cookie('accessToken', 'logout', {
                        httpOnly: true,
                        expires: new Date(Date.now()),

                    })


                    res.cookie('refreshToken', 'logout', {
                        httpOnly: true,
                        expires: new Date(Date.now()),

                    })

                    res.status(StatusCodes.OK).json(responses({ msg: 'User logged out' }))
                }




                module.exports = {
                    registerUser,
                    loginUser,
                    log
                }