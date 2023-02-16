const app = require("./app")
const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config({path:"./config.env"})

mongoose.set('strictQuery', false);

mongoose.connect(`${process.env.DATABASE}`,{useNewUrlParser:true, useUnifiedTopology:true, useCreateIndex:true, useFindAndModify:false},).then(con=>{
    console.log("udalo sie polaczyc")
}).catch(err=>{console.log("nie udalo sie polaczacyc")})

app.listen(8000,()=>{
    console.log("serwer slucha")
})
