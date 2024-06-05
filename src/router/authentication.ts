import  express from "express"
import { isLoggedIn, login, register } from "../controllers/authentication"
import { isAuthenticatied } from "../middlewares/index"
export default (router:express.Router)=>{
    router.post("/auth/register",register)
    router.post("/auth/login",login)
    router.get("/auth/isloggedin",isAuthenticatied,isLoggedIn)
}