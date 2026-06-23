import mongoose from "mongoose";
import { Schema } from "mongoose";

const userSchema = new Schema({
    firstName:{
        type:String,
        required:true,
        minLength:2,
        maxLength:20
    },
    lastName:{
        type:String,
        minLength:3,
        maxLength:20
    },
    emailId:{
        type:String,
        unique:true,
        required:true,
        trim:true,
        immutable:true
    },
    password:{
        type:String,
        minLength:6,
        required:true
    },
    age:{
        type:Number,
        min:6,
        max:80
    },
    role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    },
    problemSolved:{
        type:[String]
    }
},{timestamps:true})

const User = mongoose.model("User",userSchema)

export default User