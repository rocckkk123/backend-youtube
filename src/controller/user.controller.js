import { asynchandler } from "../utils/asynchandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.model.js";
import { uploadoncloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

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
    const {fullName,username,email, password}=res.body()
    console.log("email",email);

// if (fullName === "") {
//     throw new ApiError(400,"it is empty")
    
// }
if (
    [fullName,username,email, password].some( (field) => 
        field?.trim() === "")
) {
    throw new ApiError(400,"all the details are required")
}
const existeduser=User.findOne({
    $or:[{username},{email}]
})

if (existeduser) {
    throw new ApiError(409,"user with username or email already exists")
    
}
const avatarLocalPath=req.files?.avatar[0]?.path;
const coverImageLocalPath=req.files?.coverImage[0]?.path;
if(!avatarLocalPath)
{
    throw new ApiError(400,"avatar files are requried")
}
const avatar=uploadoncloudinary(avatarLocalPath)
const coverImage=uploadoncloudinary(coverImageLocalPath)
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
export{registerUser};