const express = require('express')
const cors = require('cors')
const ErrorHandlerController = require('./controllers/erroController')
const ErrorHandler = require('./common/ErrorHandler')
const authController = require("./controllers/authController");
const requestLogger = require("./controllers/requestLogger")

app = express()
app.use(express.json())
//app.use(bodyParser.urlencoded({ extended: true }))
app.use(
    cors({origin: ['http://localhost:8888', 'http://127.0.0.1:8888']})
);
app.use('/api/v1/users/login/',requestLogger,authController.login)
app.use('/api/v1/users/',requestLogger,require('./api/userApi'))
app.use('/api/v1/publicImages/',requestLogger,require('./api/publicCompositionApi'))
app.use('/api/v1/images/',authController.authorize,requestLogger,require('./api/compositionApi'))
app.all('*',(req,res,next)=>{next(new ErrorHandler(req,'bad route',404))})

app.use(ErrorHandlerController)


module.exports = app
