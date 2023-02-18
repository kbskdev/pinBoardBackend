const multer = require('multer')
const ErrorHandler = require('../common/ErrorHandler')
const UserModel = require('../models/userModel')
const fs = require('fs')
const mongoose = require('mongoose')

const multerStorage = multer.diskStorage({
    destination(req,file,cb){
        cb(null,`userData/${req.userId}/`)
    },
    filename(req,file,cb){
        const ext = file.mimetype.split('/')[1]
        cb(null,`zdjecie.${ext}`)
    }
})

exports.addComposition= async(req,res,next)=>{
    try{
        const compBody = await new UserModel.Composition({name:req.body.name,tags:req.body.tags})

        const newComp = await UserModel.User.findByIdAndUpdate(req.userId,
            {$push:{composition:compBody}},
            {runValidators:true,new:true})

        fs.promises.mkdir(`./userData/${req.userId}/${compBody._id}`).then(()=>{
            res.status(201).json({
                status:'success',
                compBody:compBody,
                newComp:newComp
            })}
        ).catch(
            async (err) => {
                const errBody = await UserModel.User.findByIdAndUpdate(req.userId,
                    {$pull:{composition:{_id:compBody._id}}},
                    {new:true})
                console.log(`problem with making directory, deleted: ${compBody._id}`)
                console.log(errBody)
                return next(new ErrorHandler(err,500))
            }
        )



    }catch (err){
        next(new ErrorHandler(err,400))
    }
}

exports.deleteComposition = async (req,res,next)=>{

    //
    //to z array filters
    //

    console.log(`siur`)
    try{

        const deleteQuery = await UserModel.User.findOneAndUpdate(
            {_id:req.userId},
            {$pull:{composition:{_id:req.params.composition}}},
            {new:true})

        fs.promises.rm(`./userData/${req.userId}/${req.params.composition}`,{recursive:true}).then(()=>{
            console.log(`composition ${req.params.composition} was deleted`)
            res.status(200).json({
                status:"success",
                data:`composition ${req.params.composition} was deleted`
            })
        }).catch(err=>{return next(new ErrorHandler(err,500))})
    }
    catch (err){}
}

exports.addImage = async(req,res,next)=> {
    try{
        const newImage = await new UserModel.Image({type:'image'})

        const updatedComp = await UserModel.User.findOneAndUpdate(
            {_id: mongoose.Types.ObjectId(req.userId),'composition._id':mongoose.Types.ObjectId(req.params.composition)},
            {$push: {'composition.$.images':newImage}},
            {new:true/*,runValidators:true*/})

        const multerStorage = multer.diskStorage({
            destination(req,file,cb){
                cb(null,`userData/${req.userId}/${req.params.composition}`)
            },
            filename(req,file,cb){
                const ext = file.mimetype.split('/')[1]
                cb(null,`${newImage._id}.${ext}`)
            }
        })
        const upload = multer({storage:multerStorage}).single('photo')
        upload(req,res,err=>{
            if(err) return next(new ErrorHandler(err,500))
            res.status(201).json({
                status:'succes',
                data:updatedComp
            })

        })
    }catch (err){
        return next(new ErrorHandler(err,400))
    }

}

exports.deleteImage = async (req,res,next)=>{
    const imageId = `${req.params.image}`.split('.')[0]
    try{
        const nullQuery = await UserModel.User.findOneAndUpdate(
            {_id: mongoose.Types.ObjectId(req.userId),'composition._id':mongoose.Types.ObjectId(req.params.composition)},
            {$unset:{'composition.$.images.$[img]':mongoose.Types.ObjectId(imageId)}},
            {arrayFilters:[{"img._id":imageId}],new:true})

        const deleteQuery = await UserModel.User.findOneAndUpdate(
            {_id: mongoose.Types.ObjectId(req.userId),'composition._id':mongoose.Types.ObjectId(req.params.composition)},
            {$pull:{'composition.$.images':null}},
            {new:true})

        fs.promises.unlink(`./userData/${req.userId}/${req.params.composition}/${req.params.image}`).then(()=>{
            console.log(`image ${req.params.composition}/${req.params.image} was deleted`)
            res.status(200).json({
                status:"success",
                data:`image ${req.params.composition}/${req.params.image} was deleted`
            })
        }).catch(err=>{return next(new ErrorHandler(err,500))})
    }
    catch (err){
        return next(new ErrorHandler(err,400))
    }
}

exports.changeImageOrder = async(req,res,next)=>{
    const imageId = `${req.params.image}`.split('.')[0]
    try{
        const updateImage = await UserModel.User.findOneAndUpdate(
            {_id: mongoose.Types.ObjectId(req.userId),'composition._id':mongoose.Types.ObjectId(req.params.composition)},
            {$set:{'composition.$.images.$[img].order':req.params.order}},
            {arrayFilters:[{'img._id':imageId}],new:true})

        res.status(200).json({
            status:"success",
            data:updateImage
        })
    }catch (err){
        return next(new ErrorHandler(err,400))
    }
}
exports.getOneComp = async(req,res,next)=>{
    try{
        const imageList = await UserModel.User.find({_id:req.userId,'composition._id':mongoose.Types.ObjectId(req.params.composition)},
            {_id:0,'composition.$':1})
        res.status(200).json({
            status:'success',
            data:imageList
        })
    }catch (err){
        return next(new ErrorHandler(err,400))
    }
}
exports.getCompositionList = async(req,res,next)=>{
    try{
        const compositionList = await UserModel.User.findOne({_id:req.userId}).select('-__v')
        res.status(200).json({
            status:'success',
            data:compositionList
        })
    }catch (err){
        return next(new ErrorHandler(err,400))
    }
}
exports.getImage = async(req,res,next)=>{
    try{
        res.sendFile(`./${req.userId}/${req.params.composition}/${req.params.image}`,{root:'userData'})
    }catch (err){
        return next(new ErrorHandler(err,400))
    }
}
