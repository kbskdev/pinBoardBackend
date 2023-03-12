const jwt = require('jsonwebtoken')
const User = require('../models/userModel').User
const ErrorHandler = require('../common/ErrorHandler')
const bcrypt = require('bcrypt')

exports.login = async(req,res,next)=>{
    try {
        let user = await User.findOne({username: req.body.username}).select('-__v')

        const passwordCheck = await bcrypt.compare(req.body.password,user.password)
        if(!passwordCheck) return next(new ErrorHandler(req,'bad password',401))

        const token = await jwt.sign({id:user._id,username:user.username},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRE })
        res.status(200).json({
            status:'success',
            data:user,
            token:token
        })
    }catch (err){
        next(new ErrorHandler(req,err,401))
    }
}

exports.authorize = async(req,res,next)=>{
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    try {
        const decoded = await jwt.verify(token, process.env.JWT_SECRET)
        req.userId = decoded.id
        req.userUsername = decoded.username
        next()
    }catch (err){
        next(new ErrorHandler(req,err,401))
    }
}
