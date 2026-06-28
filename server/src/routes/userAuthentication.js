import express from 'express'
import {login,register,logout,adminRegister, deleteProfile} from '../controllers/userAuthenticate.js'
import userMiddleware from '../middleware/userMiddleware.js'
import adminMiddleware from '../middleware/adminMiddleware.js'


const authRouter = express.Router();

//register
authRouter.post("/register", register);
//login
authRouter.post("/login",login);
//logout
authRouter.post("/logout",userMiddleware, logout);
//new admin registration by existing
authRouter.post('/admin/register',adminMiddleware,adminRegister);

authRouter.delete("/profile",userMiddleware,deleteProfile);

authRouter.get("/check", userMiddleware,(req,res)=>{
    const reply = {
        firstName:req.result.firstName,
        emailId:req.result.emailId,
        _id: req.result._id,
        role: req.result.role,
    }
    return res.status(200).json({
        user:reply,
        message:"Valid user"
    })
});

//GetProfile
// authRouter.get("/getprofile",getProfile);

export default authRouter