import connectDB from "./db/index.js"
import dotenv from "dotenv"


dotenv.config({
    path:'./env'
})
connectDB()
.then(process.env.PORT||8000, () => {
console.log(`server is running at port: ${process.env.PORT}`)
})
.catch("error",() => {
    console.log("mongodb is not conneted failed !!!",error)
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