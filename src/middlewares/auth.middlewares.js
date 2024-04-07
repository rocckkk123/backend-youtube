import { ApiError } from "../utils/ApiError.js";
import { asynchandler } from "../utils/asynchandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";



export const verifyJWT=asynchandler(async(req,res,next) =>
{try {
    
            const token=req.cookies?.accesstoken||req.header("Authorization")?.replace("Bearer", "")
            if (!token) {
                throw new ApiError(401,"unauthorized request")
            }
    
            const DecodedToken= jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
            console.log(DecodedToken);
            const user=await User.findById(DecodedToken?._id).select("-password -refreshToken")
            if (!user) {
                throw new ApiError(401,"invalid access token")
            }
            req.user=user; 
            next()
} catch (error) {
    throw new ApiError(401,error?.message||"invalid access")
}
})