import {v2 as cloudinary} from "cloudinary";
import exp from "constants";
import fs from "fs"


          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_NAME , 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadoncloudinary = async (localFilePath) => {
    //console.log("here");
    try {
        if (!localFilePath)  return null
    //upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath,{
        resource_type:"auto",
    })

 //   console.log(response);
        fs.unlinkSync(localFilePath)
    return response
    } catch (error) {
        fs.unlinkSync(localFilePath)
        console.log("error while uploading on cloudinary: ", error);
        return null;
    }
    
        
    
}

export{ uploadoncloudinary };



// cloudinary.uploader.upload("https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
//   { public_id: "olympic_flag" }, 
//   function(error, result) {console.log(result); });