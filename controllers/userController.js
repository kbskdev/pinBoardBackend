const Model = require('../models/userModel')
const ErrorHandler = require('../common/ErrorHandler')
const fs = require('fs')
const mongoose = require("mongoose");

exports.addUser = async(req,res,next)=>{
    try{
        const newUserId = new mongoose.Types.ObjectId()

        const newUserQuery = await Model.User.create({_id:newUserId,username:req.body.username,password:req.body.password})
        await fs.promises.mkdir(`./userData/${newUserId}`)

        res.status(201).json({
            status:'success',
            data:newUserQuery
        })
    }catch (err){
        next(new ErrorHandler(req,err,400))
    }
}
