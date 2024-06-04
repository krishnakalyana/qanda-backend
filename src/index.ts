import express from "express"
import http  from "http"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import compression from "compression"
import cors from "cors"
import 'dotenv/config'
import mongoose from "mongoose"
import router from "./router"
import session from 'express-session';
const app = express()

app.use(cors({
    credentials:true
}))
app.use(session({
    secret: process.env.SESSION_SECRET, // Add your session secret
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true, // Ensure cookies are only sent over HTTPS
      sameSite: 'strict' // Helps mitigate CSRF attacks
    }
  }));
app.use(cookieParser())
app.use(compression())
app.use(bodyParser.json())

const server = http.createServer(app)

const MONGO_URL =process.env.MONGO_CONNECTION
server.listen(process.env.PORT!,()=>{
    console.log(`Server started on http://localhost:${process.env.PORT!}`);
})

mongoose.Promise = Promise
mongoose.connect(process.env.MONGO_CONNECTION!)
mongoose.connection.on("error",(error:Error)=>{
console.log("error in Mongo connection",error);
})
mongoose.connection.on("success",()=>{
console.log("Mongo connection sucess");
})

app.use("/",router())