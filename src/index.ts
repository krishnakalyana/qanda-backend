import express from "express"
import http  from "http"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import compression from "compression"
import cors from "cors"
import 'dotenv/config'
import mongoose from "mongoose"
const app = express()

app.use(cors({
    credentials:true
}))
app.use(cookieParser())
app.use(compression())
app.use(bodyParser.json())

const server = http.createServer(app)

const MONGO_URL =process.env.MONGO_CONNECTION
server.listen(8080,()=>{
    console.log("Server started on http://localhost:8080");
})

mongoose.Promise = Promise
mongoose.connect(process.env.MONGO_CONNECTION)
mongoose.connection.on("error",(error:Error)=>{
console.log("error in Mongo connection",error);
})
mongoose.connection.on("success",()=>{
console.log("Mongo connection sucess");
})