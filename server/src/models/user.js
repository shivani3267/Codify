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
        type:[{
            type:Schema.Types.ObjectId,
            ref:'problem'
        }],
        unique:true,
    }

},{timestamps:true})

//post command will execute at end when findByIdAndDelete(attached to findOneAndDelete) to delete info from submissioin as well
userSchema.post("findOneAndDelete", async function (userInfo) {
    if(userInfo){
        await mongoose.model('submission').deleteMany({userId:userInfo._id})
    }
})

const User = mongoose.model("User",userSchema)

export default User