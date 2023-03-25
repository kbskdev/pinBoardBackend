const Model = require('../models/userModel')
const ErrorHandler = require('../common/ErrorHandler')
const fs = require('fs')
const mongoose = require("mongoose");
const {User} = require("../models/userModel");

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
exports.isAuthor = async (req,res,next)=>{
    try{
        const isAuthor = await User.findOne({'composition._id':req.body.composition,'composition.author':req.body.author},{_id:0,username:0,password:0,'composition.$':1})
        res.status(200).json({
            status:'success',
            data:isAuthor
        })
    }catch (err){
        next(new ErrorHandler(req,err,401))
    }
}
