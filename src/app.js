import express from "express"
import cors from "cors"
import cookieparser from "cookie-parser"


const app=express()

app.use(cors ({
    origin:process.env.ORIGIN_CORS,
    credentials:true
}))
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(expree.static("public"))
app.use(cookieparser())
export { app }