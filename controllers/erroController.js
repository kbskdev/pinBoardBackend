const fs = require('fs')

module.exports = async(err,req,res,next)=>{
    err.statusCode=err.statusCode || 500
    err.status = err.status || 'error'

    res.status(err.statusCode).json({
        status:err.status,
        err:err.message
    })

    fs.appendFile('./logs/errorLog.txt',`\n\n request:${err.request.url}
    requestBody:${JSON.stringify(err.request.body)}
    ${err} on:${Date()}`,
        'utf-8',(err)=>{
        if(err) return console.log(err)
        console.log('error logged')
    })
}
