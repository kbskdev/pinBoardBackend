const fs = require('fs')

module.exports = async(req,res,next)=>{

    fs.appendFile('./logs/requestLog.txt',` \n\n request:${req.url}
                                                        \n requestBody:${req.body}
                                                        \n on:${Date()}`,
        'utf-8',(err)=>{})
    next()
}
