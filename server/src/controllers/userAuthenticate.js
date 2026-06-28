import express from 'express'
import User from '../models/user.js'
import Submission from '../models/submission.js'
import {validate} from '../utils/validator.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import getToken from '../utils/token.js'
import redisclient from '../config/redis.js'

export const register = async(req,res) => {
    try {
        //validate data
        validate(req.body);

        const {firstName,emailId,password} = req.body;
        req.body.role = 'user';

        const isExists = await User.exists({emailId});

        if(isExists){
            throw new Error("User already exists");
        }
       
        //hash password
        req.body.password = await bcrypt.hash(password,10);
        //save to db
       const user =  await User.create(req.body);
        const reply={
            firstName:user.firstName,
            emailId:user.emailId,
            _id:user._id,
            role:user.role,
        }
    
       const token = getToken({_id:user._id, role:user.role,  emailId});
       res.cookie('token',token, {maxAge:60*60*1000});
       res.status(201).json({
            user:reply,
            message:"Registered Successfully"
        });

    } catch (error) {
        return res.status(400).send(error.message)
    }
}

export const login = async (req,res) => {
    try{
        const {emailId, password} = req.body;

        if(!emailId || !password){
            throw new Error("All fields are required");
        }
        
       const user = await User.findOne({emailId});
       if(!user){
            throw new Error("User doesn't exists");
       }
       const passwordmatch = await bcrypt.compare(password,user.password);
       if(!passwordmatch){
            throw new Error("Invalid Credentials");
       }
       const reply={
            firstName:user.firstName,
            emailId:user.emailId,
            _id:user._id,
            role:user.role,
        }

       const token = getToken({_id:user._id, role:user.role, emailId});
       res.cookie('token',token, {maxAge:60*60*1000});
       res.status(201).json({
            user:reply,
            message:"Logged in Successfully"
        })

    }  
    catch(err){
        res.status(401).send("Unauthorised access" + err.message)
    } 
}

//logout - redis used
export const logout =  async (req,res) => {
    try {
        //validate token
        //add token to redis blocklist
        const {token} = req.cookies;
        const payload = jwt.decode(token);
        await redisclient.set(`token:${token}`,'Block');
        await redisclient.expireAt(`token:${token}`,payload.exp)
        
        //cookie ko expire kar 
        res.cookie("token",null,{expires:new Date(Date.now())});
        res.status(200).send("Logged out successfully");

    } catch (error) {
        res.status(503).send("ERROR!" + error)
    }
}

export const adminRegister = async (req,res) => {
    try {
        //validate data
        validate(req.body);

        const {firstName,emailId,password} = req.body;
        req.body.role = 'admin';

        const isExists = await User.exists({emailId});

        if(isExists){
            throw new Error("User already exists");
        }
        //hash password
        req.body.password = await bcrypt.hash(password,10);
        //save to db
        
       const user =  await User.create(req.body);
    //    const token = getToken({_id:user._id, role:user.role,  emailId});
    //    res.cookie('token',token, {maxAge:60*60*1000});
       res.status(201).send("User created successfully");

    } catch (error) {
        return res.status(400).send("Error" + error)
    }
}


export const deleteProfile = async (req,res) => {
    try {
        const userId = req.result._id;
       await User.findByIdAndDelete(userId);
       //delete submission history another way
    //    await Submission.deleteMany({userId});

       res.status(200).send("Deleted Successfully")

    } catch (error) {
        return res.status(500).send("INternal Server Error");
    }
}
