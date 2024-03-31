import connectDB from "./db/index.js"
import dotenv from "dotenv"
import {app} from './app.js'

dotenv.config({
    path:'./.env'
})

connectDB()
.then(()=>{
    app.on("error", (err) => {
        console.log("server error: ", err);
        throw err
    })

    app.listen(process.env.PORT||8000, () => {
        console.log(`server is running at port: ${process.env.PORT}`)
    })
})
.catch((err) => {
    console.log("Mongodb connection failed: ", err);
})







/*
import mongoose from "mongoose";
import {DB_NAME} from "./constant";
import express from "express";
const app=express()

( async () => {
    try {
       await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on(ERROR,(error) => {
            console.log("error",error)
            throw error
        })
        app.listen(process.env.PORT ,() => {
            console.log(`App is listening on port ${process.env.PORT}`)
        })
    } catch (error) {
        console.error("ERROR:",error);
        throw Error
    }
})()
*/