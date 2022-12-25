require('dotenv').config()
require('express-async-errors')

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const xss = require('xss-clean')
const exp = require('express-rate-limit')
const cookieParser = require('cookie-parser')


app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' })); //handlebars
app.set('view engine', 'handlebars')

const NotFoundError = require('./middlewares/notFountError')
const errorHandlerMiddleware = require('./middlewares/errorHandler')


//bodyParser  middleware

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(cookieParser(process.env.JWT_SECRET))


app.set('trust proxy', 1)

app.use(exp({
    windowMs: 15 * 60 * 1000,
    max: 100,
}))

//extra security package

app.use(morgan('tiny'))
app.use(helmet())
app.use(cors())
app.use(xss())




app.use(express.static('./public'))

const routerPayment = require('./Router/router')
const userRouter = require('./Router/userRoute')
const uploadRouter = require('./Router/uploadRoute')
const userSetting = require('./Router/settings')

const keys = require('./config/keys')
const connectDb = require('./db/connect')





app.use('/api/v1/auth', routerPayment)  //routes
app.use('/api/v1/auth', userRouter)
app.use('/api/v1/auth', uploadRouter)
app.use('/api/v1/auth', userSetting)



app.use(NotFoundError)          //Error handleMiddlewares
app.use(errorHandlerMiddleware)


app.get('/', (req, res) => {

    res.render('index', {
        Publishablekey: keys.Publishablekey
    })
})



const port = process.env.PORT || 5000



const start = async () => {
    try {
        await connectDb('mongodb://0.0.0.0:27017')

        app.listen(port, () => console.log(`listening on port ${port}`))

    } catch (error) {
        console.log(error);
    }
}


start()