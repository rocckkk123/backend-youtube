import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";


const connectDB = async () => {
    try {
        const connectioninstances=await mongoose.connect (`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`mongodb connection !! host :${connectioninstances.connection.host}`)
    } catch (error) {
        console.log("connection failed",error);
        process.exit(1)
    }
}

export default connectDB