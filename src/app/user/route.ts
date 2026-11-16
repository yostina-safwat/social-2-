import {Router} from "express";
import userController from "./controller/user.controller";
import {multerUploadSingle} from "../../lib/media/multer";
import {authGuard} from "../../lib/auth/authGuard";

export const userRouter = Router();

userRouter.post('/upload-profile-pic', authGuard, multerUploadSingle('pp'), userController.uploadProfilePicture);
userRouter.delete('/delete-profile-pic', authGuard, userController.deleteProfilePic);
