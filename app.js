require('dotenv').config()
require('express-async-errors')

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars')
const morgan = require('morgan')


    app.engine('handlebars',exphbs.engine({defaultLayout:'main'})); //handlebars
    app.set('view engine' , 'handlebars')

    const NotFoundError = require('./middlewares/notFountError')
    const errorHandlerMiddleware = require('./middlewares/errorHandler')


    //bodyParser  middleware

    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({extended:false}))

    app.use(morgan('tiny'))



    app.use(express.static('./public'))

    const routerPayment = require('./Router/router')
    const userRouter = require('./Router/userRoute')
    const uploadRouter = require('./Router/uploadRoute')
    const userSetting = require('./Router/settings')

    const keys = require('./config/keys')
    const connectDb = require('./db/connect')

    const fileUpload = require('express-fileupload')
    const cookieParser = require('cookie-parser')


    


    app.use(cookieParser(process.env.JWT_SECRET))
    app.use(fileUpload({useTempFiles:true}))
    


    app.use('/api/v1/auth',routerPayment)  //routes
    app.use('/api/v1/auth',userRouter)
    app.use('/api/v1/auth',uploadRouter)
    app.use('/api/v1/auth',userSetting)



    app.use(NotFoundError)          //Error handleMiddlewares
    app.use(errorHandlerMiddleware)


    app.get('/',(req,res)=>{

        res.render('index',{
            Publishablekey:keys.Publishablekey
        })
    })



    const port = process.env.PORT || 5000



    const start = async() =>{
        try {
            await connectDb('mongodb://0.0.0.0:27017')

            app.listen(port, () => console.log(`listening on port ${port}`))
            
        } catch (error) {
            console.log(error);
        }
    }


    start()