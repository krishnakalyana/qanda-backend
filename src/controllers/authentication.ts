import { createUser, getUserByEmail } from "../db/user"
import express from "express"
import { authentication, random } from "../helpers/index"

export const register = async (req:express.Request,res:express.Response)=>{
    try{
        const {email,password,username}=req.body
        if(!email || !password || !username){
           return res.sendStatus(400)
        }
        const existingUser = await getUserByEmail(email)
        if(existingUser){
           return res.sendStatus(400)
        }
        const salt = random()
        const user = await createUser({
            email,
            username,
            authentication:{
                salt,
                password:authentication(salt,password),
            },
        })
        return res.status(201).json(user);
    }catch(error){
    console.log("Error in Register api",error);
    return  res.sendStatus(400)
    }
}
export const login = async (req:express.Request,res:express.Response)=>{
    try{

        const {email,password} = req.body
        if(!email || !password){
            return res.sendStatus(400)
        }
        const user = await getUserByEmail(email).select('+authentication.salt +authentication.password')
        if(!user){
            return res.sendStatus(400)
        }
        const expectedHash = authentication(user.authentication.salt,password)
        if(user.authentication.password !== expectedHash){
            return res.sendStatus(403)
        }
        const salt = random()
        user.authentication.sessionToken = authentication(salt,user._id.toString())
        await user.save()
        res.cookie(process.env.COOKIE_KEY,user.authentication.sessionToken,{domain:process.env.DOMAIN,path:process.env.PATH})
        return res.send(200).json(user).end();
    } catch(error){
        console.log("Error in login",error);
        return res.sendStatus(400)
    }
    }