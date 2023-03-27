const ErrorHandler = require('../common/ErrorHandler')
const UserModel = require('../models/userModel')
const mongoose = require("mongoose");


// exports.isPublic = async(req,res,next)=>{
//     try{
//         const imageList = await UserModel.User.findById(req.params.user,{_id:0,composition:{$elemMatch:{_id:req.params.composition,public:"public"}}})
//         res.status(200).json({
//             status:'success',
//             data:imageList
//         })
//     }catch (err){
//         return next(new ErrorHandler(req,err,400))
//     }
// }

exports.getPublicCompList = async(req,res,next)=>{
    try{
        const compositionList = await UserModel.User.aggregate([{$unwind:"$composition"},{$match:{'composition.public':'public',_id:mongoose.Types.ObjectId(req.params.user)}},{$project:{_id:0,composition:'$composition'}}])
        res.status(200).json({
            status:'success',
            data:compositionList
        })
    }catch (err){
        return next(new ErrorHandler(req,err,400))
    }
}

exports.getOneCompPublic = async(req,res,next)=>{
    try{
        const imageList = await UserModel.User.find({_id:req.params.user},{_id:0,composition:{$elemMatch:{_id:req.params.composition,public:"public"}}})

        res.status(200).json({
            status:'success',
            data:imageList
        })
    }catch (err){
        return next(new ErrorHandler(req,err,400))
    }
}
exports.getImagePublic = async(req,res,next)=>{

    try{
        const imageList = await UserModel.User.findOne({_id:req.params.user,'composition._id':req.params.composition},
            {_id:0,'composition.$':1})
        if(imageList!=null){
            res.sendFile(`./${req.params.user}/${req.params.composition}/${req.params.image}`,{root:'userData'})
        }
        else { // noinspection ExceptionCaughtLocallyJS
            throw "image is in not public board"
        }
    }catch (err){
        return next(new ErrorHandler(req,err,400))
    }
}
