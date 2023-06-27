const express = require('express')
const cors = require('cors')
const ErrorHandlerController = require('./controllers/erroController')
const ErrorHandler = require('./common/ErrorHandler')
const authController = require("./controllers/authController");
const requestLogger = require("./controllers/requestLogger")

app = express()
app.use(express.json())
//app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors());
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.use('/api/v1/users/login/',requestLogger,authController.login)
app.use('/api/v1/users/',requestLogger,require('./api/userApi'))
app.use('/api/v1/publicImages/',requestLogger,require('./api/publicCompositionApi'))
app.use('/api/v1/images/',authController.authorize,requestLogger,require('./api/compositionApi'))
app.all('*',(req,res,next)=>{next(new ErrorHandler(req,'bad route',404))})

app.use(ErrorHandlerController)


module.exports = app
