import express from "express"
import {get,merge} from "lodash"
import { getUserBySessionToken } from "../db/user"
export const isAuthenticatied =async(req:express.Request,res:express.Response,next:express.NextFunction)=>{
    try{
        const sessionToken =req.headers.authorization
        if(!sessionToken){
           return res.sendStatus(401)
        }
        let token= sessionToken.split(" ")[1]
        
        const existingUser = await getUserBySessionToken(token)
        
        if(!existingUser){
           return res.sendStatus(401)
        }
        merge(req,{identity:existingUser})
        return next()
    }
    catch(error){
        console.log("Error in is authenticated",error)
        return res.sendStatus(400)
    }
}