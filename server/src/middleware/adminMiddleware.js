import jwt from 'jsonwebtoken';
import User from '../models/user.js'
import  redisclient  from '../config/redis.js';

const adminMiddleware = async (req,res,next) => {
    try {
        const {token} =  req.cookies;

        if(!token){
            throw new Error("Token not found");
        }
        const payload = await jwt.verify(token,process.env.JWT_SECRET_KEY);

        const {_id} = payload;
        if(!_id){
            throw new Error("Invalid token")
        }

        const result = await User.findById(_id);

        if(result.role !== 'admin'){
            throw new Error("Invalid token");
        }

        if(!result){
            throw new Error("User doesn't exists");
        }

        const IsBlocked = await redisclient.exists(`token:${token}`);
        if(IsBlocked){
            throw new Error("Invalid token")
        }
        next();

    } catch (error) {
        res.status(401).send("Error" + error)
    }
}

export default adminMiddleware