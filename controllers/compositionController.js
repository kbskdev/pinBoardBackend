const multer = require('multer')
const ErrorHandler = require('../common/ErrorHandler')
const UserModel = require('../models/userModel')
const fs = require('fs')
const mongoose = require('mongoose')
const sizeOf = require('image-size')


exports.addComposition= async(req,res,next)=>{
    try{
        const compBody = await new UserModel.Composition({
            name:req.body.name,tags:req.body.tags,author:req.userId,public:req.body.public})

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
                return next(new ErrorHandler(req,err,500))
            }
        )



    }catch (err){
        next(new ErrorHandler(req,err,400))
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
        }).catch(err=>{return next(new ErrorHandler(req,err,500))})
    }
    catch (err){}
}

exports.getOneComp = async(req,res,next)=>{
    try{
        const imageList = await UserModel.User.findOne({_id:req.userId,'composition._id':mongoose.Types.ObjectId(req.params.composition)},
            {_id:0,'composition.$':1})
        res.status(200).json({
            status:'success',
            data:imageList
        })
    }catch (err){
        return next(new ErrorHandler(req,err,400))
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
        return next(new ErrorHandler(req,err,400))
    }
}

exports.addImage = async(req,res,next)=> {
    try{
        const newImageId = new mongoose.Types.ObjectId()
        let ext = ""


        const multerStorage = multer.diskStorage({
            destination(req,file,cb){
                cb(null,`userData/${req.userId}/${req.params.composition}`)
            },
            filename(req,file,cb){


                ext = file.mimetype.split('/')[1]
                cb(null,`${newImageId}.${ext}`)
            }
        })
        const upload = multer({storage:multerStorage}).fields([
            {name:'photo',maxCount:1},{name:'x',maxCount:1},{name:'y',maxCount:1},
            {name:'title',maxCount:1},{name:'date',maxCount:1},{name:'description',maxCount:1}])
        upload(req,res, async err=>{
            if(err) {return next(new ErrorHandler(req,err,500))}

            try {
                function sizeOfPromise (path){return new Promise(((resolve, reject) => {
                    sizeOf(path,(err,dimension)=>{
                        if(err) reject(err)

                        resolve({width:dimension.width,height:dimension.height})
                    })
                }))}
                const size = await sizeOfPromise(`userData/${req.userId}/${req.params.composition}/${newImageId}.${ext}`)

                const newImage = await new UserModel.Image(
                    {_id:newImageId,type:'image',extension:ext,position:{x:req.body.x,y:req.body.y},
                          title:req.body.title,date:req.body.date,description:req.body.description,originalSize:{width:size.width,height:size.height},currentSize:{width:size.width,height:size.height}})
                //
                const updatedComp = await UserModel.User.findOneAndUpdate(
                    {_id: mongoose.Types.ObjectId(req.userId),'composition._id':mongoose.Types.ObjectId(req.params.composition)},
                    {$push: {'composition.$.images':newImage}},
                    {new:true/*,runValidators:true*/})

                res.status(201).json({
                    status:'success',
                    data:newImage
                })
            }catch (err){
                return next(new ErrorHandler(req,err,400))
            }
        })


    }catch (err){
        return next(new ErrorHandler(req,err,400))
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
        }).catch(err=>{return next(new ErrorHandler(req,err,500))})
    }
    catch (err){
        return next(new ErrorHandler(req,err,400))
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
        return next(new ErrorHandler(req,err,400))
    }
}

exports.changeImagePosition = async(req,res,next)=>{
    const imageId = `${req.params.image}`.split('.')[0]
    try{
        const updatedImage = await UserModel.User.findOneAndUpdate(
            {_id: mongoose.Types.ObjectId(req.userId),'composition._id':mongoose.Types.ObjectId(req.params.composition)},
            {$set:{'composition.$.images.$[img].position':{x:req.params.x,y:req.params.y}}},
            {arrayFilters:[{'img._id':imageId}],projection:{'composition.$':1}})

        res.status(200).json({
            status:"success",
            data:updatedImage
        })
    }catch (err){
        return next(new ErrorHandler(req,err,400))
    }
}

exports.changeImageSize = async (req,res,next)=>{
    const imageId = `${req.params.image}`.split(".")[0]

    try{
        const updatedImage = await UserModel.User.findOneAndUpdate(
            {_id:mongoose.Types.ObjectId(req.userId),'composition._id':mongoose.Types.ObjectId(req.params.composition)},
            {$set:{'composition.$.images.$[img].currentSize':{width:req.params.width,height:req.params.height}}},

            {arrayFilters:[{'img._id':imageId}],projection:{'composition.$':1}}
        )
        res.status(200).json({
            status: "success",
            data: updatedImage
        })

    }catch (err){
        return next(new ErrorHandler(req,err,400))
    }
}

exports.changeImageInfo = async (req,res,next)=> {
    const imageId = `${req.params.image}`.split(".")[0]
    try{
        const updatedImage = await UserModel.User.findOneAndUpdate(
            {_id:mongoose.Types.ObjectId(req.userId),'composition._id':mongoose.Types.ObjectId(req.params.composition)},
            {$set:{'composition.$.images.$[img].title':req.body.title, 'composition.$.images.$[img].date':req.body.date, 'composition.$.images.$[img].description':req.body.description}},
            {arrayFilters:[{'img._id':imageId}],projection:{'composition.$':1}}
        )

        res.status(200).json({
            status: "success",
            data: updatedImage
        })
    }catch (err){
        return next(new ErrorHandler(req,err,400))
    }
}

exports.getImage = async(req,res,next)=> {
    try{
        res.sendFile(`./${req.userId}/${req.params.composition}/${req.params.image}`,{root:'userData'})
    }catch (err){
        return next(new ErrorHandler(req,err,400))
    }
}
