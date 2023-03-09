const Model = require('../models/userModel')
const ErrorHandler = require('../common/ErrorHandler')
const fs = require('fs')

exports.addUser = async(req,res,next)=>{
    try{
        const newUser = new Model.User({username:req.body.username,password:req.body.password})
        await fs.promises.mkdir(`./userData/${newUser._id}`)
        const newUserQuery = await Model.User.create(newUser)
        res.status(201).json({
            status:'success',
            data:newUserQuery
        })
        next()
    }catch (err){
        next(new ErrorHandler(err,400))
    }
}
