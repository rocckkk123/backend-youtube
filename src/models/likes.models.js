
import mongoose,{Schema, Types} from "mongoose";

const likesSchema=new Schema({
    createdAt:{
        types:String,
        required:true
    },
    comment:{
        type:Schema.Types.ObjectId,
        ref:"Comment"
    },
    likedBy:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    tweet:{
        type:Schema.Types.ObjectId,
        ref:"Tweet"
    }
},
    {timestamps:true})

export const Likes=mongoose.model("Likes",likesSchema)