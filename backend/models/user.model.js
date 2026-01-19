//models/user.model.js

import  mongoose, { Schema } from "mongoose";


const userShecma = new Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['Admin','User'],
        default:"User",
        required:false
    }
},{timestamps:true});



const User = mongoose.model("User",userShecma)

export default User