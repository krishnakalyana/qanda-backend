import { deleteUserById, getUserById, getUsers } from "../db/user"
import express from "express"

export const getAllUsers = async (req:express.Request,res:express.Response)=>{
    try{
        const users = await getUsers()
        return res.status(200).json(users).end()
    }catch(error){
        console.log("Error in get All user",error)
        return res.sendStatus(400)
    }
}
export const deleteUser = async (req:express.Request,res:express.Response)=>{
    try {
        const {id}= req.params
        const deletedUser = await deleteUserById(id)
        return res.status(200).json(deleteUser).end()
    } catch (error) {
        console.log("Error in deletion ",error);
       return res.sendStatus(400)
        
    }
}
export const updateUser = async(req:express.Request,res:express.Response)=>{
    try {
        const {username}= req.body
        const {id} = req.params
        if(!username){
            res.sendStatus(400)
        }
        const user = await getUserById(id)
        user.username = username
        await user.save()
        return res.status(200).json(user).end()
    } catch (error) {
        console.log("Error in update user",error);
        return res.sendStatus(400)
    }
}