import { Router } from "express";
import {
    getCurrentUser,
    getUserChannelsProfile,
    getUserWatchHistory,
    loginUser, 
    logoutUser,
    refreshAcessToken, 
    registerUser,
    updateCurrentPassword, 
    updateUserAvatar,
    updateUserDetalis, 
    updateUsercoverImage
    } 
    from "../controller/user.controller.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";


const router = Router()

router.route('/register').post(
    upload.fields(
        [
            {
                name:"avatar",
                maxCount:1
            },
            {
                name:"coverImage",
                maxCount:1
            }
        ]
    ),
    registerUser
    )
    router.route('/login').post(loginUser)
    router.route('/logout').post(verifyJWT,logoutUser)
    router.route('/refresh-token').post(refreshAcessToken)

    router.route('/change-password').post(verifyJWT,updateCurrentPassword)

    router.route('/current-user').get(verifyJWT,getCurrentUser)
    router.route('/update-account').patch(verifyJWT,updateUserDetalis)
    router.route('/avatar').patch(verifyJWT,upload.single("avatar"),updateUserAvatar)
    router.route('/cover-image').patch(verifyJWT,upload.single("coverImage"),updateUsercoverImage)
    router.route('/c/:username').get(verifyJWT,getUserChannelsProfile)
    router.route('/History').get(verifyJWT,getUserWatchHistory)
export default router