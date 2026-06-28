//submission schema of user solved problems
import mongoose from "mongoose";
import { Schema } from "mongoose";

const submissionSchema = new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    problemId:{
        type:Schema.Types.ObjectId,
        ref:'problem',
        required:true
    },
    code:{
        type:String,
        required:true,
    },
    language:{
        type:String,
        required:true,
        enum:['javascript','c++','java']
    },
    status:{
        type:String,
        required:true,
        enum:['pending','accepted','wrong','error'],
        default:'pending'
    },
    runtime:{
        type:Number,
        default:0
    },
    memory:{
        type:Number,
        default:0
    },
    errorMessage:{
        type:String,
        default:''
    },
    testCasePassed:{
        type:Number,
        default:0
    },
    testcasesTotal:{
        type:Number,
        default:0
    },
},{timestamps:true})

submissionSchema.index({userId:1,problemId:1}) //compound indexing for fast searching of user's submission and ordered one by asc(-1 for desc), it also add advantage to query over user_id in optimal time

const Submission = mongoose.model('submission',submissionSchema);
export default Submission;