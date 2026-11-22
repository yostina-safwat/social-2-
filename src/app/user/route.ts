import {Router} from "express";
import container from "../../lib/di/container";
import {TOKENS} from "../../lib/di/tokens";
import {UserController} from "./controller/user.controller";
import {multerUploadSingle} from "../../lib/media/multer";
import {authGuard} from "../../lib/auth/authGuard";
import {validate} from "../../lib/validation/validate";
import {presignedUrlSchema} from "./validation/user.validation";

const userController = container.resolve<UserController>(TOKENS.UserController);

export const userRouter = Router();

userRouter.use(authGuard);

userRouter.post('/upload-profile-pic', multerUploadSingle('pp'), userController.uploadProfilePicture);
userRouter.post('/get-presigned-url', validate({body: presignedUrlSchema}), userController.generatePresignedUrl);
userRouter.delete('/delete-profile-pic', userController.deleteProfilePic);
