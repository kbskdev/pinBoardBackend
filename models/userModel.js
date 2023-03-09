const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')

const ImageSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['image', 'text'],
        required: [true,'type is required']
    },
    text:{
        type: String,
    },
    extension:{
        type:String
    },
    title:{
        type:String,
    },
    subTitle:{
        type:String,
    },
    note:{
        type:String,
    },
    order:{
        type:Number,
        //required: [true,'order place is required'],
        //unique:[true,"two photos cant be in same order"]
    },
    votes:{
        type:Number,
        default: 0
    },
    position:{
        type:Map,
        of:Number,
        required: [true,'position is required']
    }

},{autoCreate:false})


const CompositionSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'composition name is required']
    },
    votes:{
        type:Number,
        default: 0
    },
    tags:[String],
    images:[ImageSchema]

},{autoCreate:false})

const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        unique:[true,"there is already user with that nick"],
        required:[true,"username must be included"]
    },
    email:{
        type:String,
        // unique:[true,"that email is already used"],
        // //required:[true,"email must be included"],
        // validate:[validator.isEmail,'invalid email']
    },
    password:{
        type:String,
        required:[true,"password is required"],
    },
    permissions:{
        type:String,
        default:"normal",
        select:false,
        enum:['normal','admin']
    },
    composition:[CompositionSchema]
},{autoCreate:false})



UserSchema.pre('save',async function (next){
    this.password = await bcrypt.hash(this.password, 12)
    next()
})


const Users = mongoose.model('users',UserSchema)

const Composition = mongoose.model('composition',CompositionSchema)

const Image = mongoose.model('image',ImageSchema)

exports.User = Users
exports.Composition = Composition
exports.Image = Image
