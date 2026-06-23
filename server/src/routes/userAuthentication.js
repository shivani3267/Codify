import express from 'express'
import {login,register,logout,adminRegister} from '../controllers/userAuthenticate.js'
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
//GetProfile
// authRouter.get("/getprofile",getProfile);

export default authRouter