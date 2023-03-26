const ErrorHandler = require('../common/ErrorHandler')
const UserModel = require('../models/userModel')

exports.getPublicCompList = async(req,res,next)=>{
    try{
        const compositionList = await UserModel.User.find({_id:req.params.user,'composition.public':"public"}).select('-__v')
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
        const imageList = await UserModel.User.find({_id:req.params.user,'composition._id':req.params.composition,'composition.$.votes':2})
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
        const imageList = await UserModel.User.findOne({_id:req.params.user,'composition._id':req.params.composition,'composition.public':"public"},
            {_id:0,'composition.$':1})
        if(imageList!=null){
            res.sendFile(`./${req.params.user}/${req.params.composition}/${req.params.image}`,{root:'userData'})
        }
        else throw "image is in not public board"
    }catch (err){
        return next(new ErrorHandler(req,err,400))
    }
}
