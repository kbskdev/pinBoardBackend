const express = require('express')
const cors = require('cors')
const ErrorHandlerController = require('./controllers/erroController')
const ErrorHandler = require('./common/ErrorHandler')
const authController = require("./controllers/authController");
const requestLogger = require("./controllers/requestLogger")
app = express()
app.use(express.json())
//app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use('/api/v1/users/login/',requestLogger,authController.login)
app.use('/api/v1/users/',requestLogger,require('./api/userApi'))
app.use('/api/v1/images/',authController.authorize,requestLogger,require('./api/compositionApi'))
app.all('*',(res,req,next)=>{next(new ErrorHandler(req,'bad route',404))})

app.use(ErrorHandlerController)


module.exports = app
