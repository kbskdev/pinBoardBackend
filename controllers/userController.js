const Model = require('../models/userModel')
const ErrorHandler = require('../common/ErrorHandler')
const fs = require('fs')

exports.addUser = async(req,res,next)=>{
    try{
        const query = await Model.User.create({username:req.body.username,email:req.body.email,password:req.body.password})
        res.status(201).json({
            status:'success',
            data:query
        })
        await fs.mkdir(`./userData/${query._id}`,err => {
            if(err) throw err
        })
    }catch (err){
        next(new ErrorHandler(err,400))
    }
}
