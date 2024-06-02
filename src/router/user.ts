import  express  from "express";
import { deleteUser, getAllUsers, updateUser } from "../controllers/users";
import { isAuthenticatied } from "../middlewares";
export default (router:express.Router)=>{
    router.get('/users',isAuthenticatied,getAllUsers)
    router.delete('/users/:id',isAuthenticatied,deleteUser)
    router.patch('/users/:id',isAuthenticatied,updateUser)
}