const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const ImageSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['image', 'text'],
        required: [true,'type is required']
    },
    extension:{
        type:String
    },
    title:{
        type:String,
    },
    description:{
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
    },
    originalSize:{
        type:Map,
        of:Number,
        required: [true,'size is required']
    },
    currentSize:{
        type:Map,
        of:Number,
        required: [true,'current size is required']
    },
    date:{
        type:String
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
    images:[ImageSchema],
    public:{
        type:String,
        enum:['public','private'],
        default:'private'
    },
    author:{
        type:String,
        required:[true,'author is required']
    },
    admin_password:{type:String,default:""},
    public_password:{type:String,default:""},

},{autoCreate:false})

const SavedBoards = new mongoose.Schema({
    author:{
        type:String,
        required:[true,"author is required"]
    },
    board_id:{
        type:String,
        required:[true,"author is required"]
    }
})

const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        unique:[true,"there is already user with that nick"],
        required:[true,"username must be included"]
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
    composition:[CompositionSchema],
    savedBoards:[SavedBoards],
    observed_users:[String]
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
