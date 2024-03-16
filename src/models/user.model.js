import mongoose,{Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema=new Schema(
    {
        username:{
            type:String,
            requried:true,
            lowercase:true,
            trim:true,
            unqiue:true,
            index:true
        },
        email:{
            type:String,
            requried:true,
            lowercase:true,
            trim:true,
            unqiue:true,
        },
        password:{
            type:String,
            requried:[true,"passwprd is requried"],
            unqiue:true,
        },
        fullName:{
            type:String,
            requried:true,
            trim:true,
            index:true
        },
        avatar:{
            typr:String,//cloudinary url
            requried:true
        },
        coverImage:{
            typr:String//cloudinary url
        },
        watchHistory:[
            {
                type:Schema.Types.IndexId,
                ref:"Video"
            }
        ],
        refreshToken:{
            type:String
        }
},{timestamps:true})

userSchema.pre("save",async function(next)  {
    if(!this.isModified(password)) return next();

    this.password=bcrypt.hash(this.password,10)
    next()
})

userSchema.methods.isPasswordCorrect= async function(password){
    return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken= function() {
    jwt.sign(
        {
        _id:this._id,
        username:this.username,
        email:this.email,
        fullName:this.fullName
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    })
}
userSchema.methods.generateRefreshToken= function () {
    jwt.sign(
        {
        _id:this._id
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    })
}
export const User=mongoose.model("User",userSchema)