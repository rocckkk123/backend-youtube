import { asynchandler } from "../utils/asynchandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.model.js";
import { uploadoncloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { jwt } from "jsonwebtoken";


const generateAccessTokenandRefreshToken=async(userId) => {
    try {
        const user=await User.findById(userId)
        const accesstoken=user.generateAccessToken()
        const refreshtoken=user.generateRefreshToken()

        user.refreshtoken=refreshtoken
        await user.save({ validateBeforeSave:false })
        return{accesstoken,refreshtoken}
    } catch (error) {
        throw new ApiError(500,"something went wrong")
    }


}
const registerUser = asynchandler( async (req,res) => {
    //get user details from frontend
    // check validation - not empty
    // check if user already exits- usename,email
    // check for image,check for avatar
    // upload them to cloudinary,avatar
    // create user object-create entry in db
    // remove password and refresh token from response
    // check for user creation
    // check res
    const {fullName,username,email, password}=req.body
   // console.log("email",email);

// if (fullName === "") {
//     throw new ApiError(400,"it is empty")
    
// }
if (
    [fullName,username,email, password].some( (field) => 
        field?.trim() === "")
) {
    throw new ApiError(400,"all the details are required")
}
const existeduser=await User.findOne({
    $or:[{username},{email}]
})

if (existeduser) {
    throw new ApiError(409,"user with username or email already exists")
    
}

//console.log(req.files);
const avatarLocalPath=req.files?.avatar[0]?.path;
//const coverImageLocalPath=req.files?.coverImage[0]?.path;
let coverImageLocalPath;
if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length >0) {
    coverImageLocalPath=req.files.coverImage[0].path;
}
if(!avatarLocalPath)
{
    throw new ApiError(400,"avatar files are requried")
}
const avatar = await uploadoncloudinary(avatarLocalPath)

// console.log(avatar);


const coverImage= await uploadoncloudinary(coverImageLocalPath)

// console.log(coverImage);
if(!avatar){
    throw new ApiError(400,"avatar files are requried")
}
const user= await User.create(
    {
        fullName,
        email,
        avatar:avatar.url,
        coverImage:coverImage?.url|| "",
        username:username.toLowerCase(),
        password
    }
)

 const createduser=await User.findById(user._id).select(
    "-password -refreshToken"
)
if (!createduser) {
    throw new ApiError(500,"something went wrong user is not created")
}
return res.status(200).json(
    new ApiResponse(201,createduser,"user created successfully")
)
})
const loginUser=asynchandler(async (req,res) => {
        //req body->data
        //username or email validation 
        //check user
        //password check
        //generate acess token and refresh token
        //cookies
        const{username,email,password}=req.body

        if(!(username||email)){
            throw new ApiError(404,"username or email not found")
        }

       const user= await User.findOne({
            $or:[{username},{email}]
        })
        if (!user) {
            throw new ApiError(401,"user dosenot exist")
            
        }
        //const logineduser=await User.findById(user._id)
        const ispasswordvalid=await user.isPasswordCorrect(password)
        console.log(password);
        if (!ispasswordvalid) {
            throw new ApiError(402,"wrong password has been entered")
            
        }
        const{accesstoken,refreshtoken}= await generateAccessTokenandRefreshToken(user._id)
        const loggedInUser=await User.findById(user._id).select("-password -refreshToken")

        const options={
            httpOnly:true,
            secure:true
        }
        return res.status(200)
        .cookie("accesstoken",accesstoken,options)
        .cookie("refreshtoken",refreshtoken,options)
        .json(
            new ApiResponse(
                200,
                {
                    user:loggedInUser,accesstoken,refreshtoken
                },
                "user logedin succesfully "
            )
        )
})
const logoutUser=asynchandler(async(req,res) =>
{
   await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshtoken:undefined
            }
        },
        {
            new:true
        }
    )
    const options={
        httpOnly:true,
        secure:true
    }
    return res
    .status(200)
    .clearCookie("refreshtoken",options)
    .clearCookie("accesstoken",options)
    .json(new ApiResponse(200),{},"user logged out")
})
const refreshAcessToken=asynchandler( async(req,res) => {
    const incomingRefreshToken=req.cookies.refreshtoken||req.body.refreshtoken

    if (!incomingRefreshToken) {
        throw new ApiError(401,"invalid request")
    }
    try {
        const decodedToken=jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
    
        const user=User.findById(decodedToken?._id)
        if (!user) {
            throw new ApiError(401,"invalid refresh token")        
        }
        if (incomingRefreshToken!== user?.refreshtoken) {
            throw new ApiError(401,"refresh token is expired or used")
        }
        const options={
            httpOnly:true,
            secure:true
        }
        const {accesstoken,newRefreshToken}=await generateAccessTokenandRefreshToken(user._id)
        return res
        .status(200)
        .cookie("accesstoken",accesstoken,options)
        .cookie("refreshtoken",newRefreshToken,options)
        .json(
            200,{
                accesstoken,refreshtoken:newRefreshToken
            },
            "access token refreshed"
        )
    } catch (error) {
        throw new ApiError(401,error?.message||"invalid refresh token")
    }
})
export{registerUser,
        loginUser,
        logoutUser,
        refreshAcessToken
};