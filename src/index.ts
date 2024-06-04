import express from "express"
import http  from "http"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import compression from "compression"
import cors from "cors"
import 'dotenv/config'
import mongoose from "mongoose"
import router from "./router"
const app = express()

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200,
}))

app.use(cookieParser())
app.use(compression())
app.use(bodyParser.json())

const server = http.createServer(app)

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