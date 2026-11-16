import {NextFunction, Request, Response} from "express";
import userService from "../service/user.service";
import {AppError} from "../../../lib/error/error";

class UserController {
    private readonly userService = userService;

    uploadProfilePicture = async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.file) throw new AppError('no file provided', 400);
            await this.userService.uploadProfilePicture(req.file, req.user!.sub as string);
            res.json({message: "profile picture uploaded", success: true});
        } catch (error) {
            next(error);
        }
    }

    deleteProfilePic = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await this.userService.deleteProfilePicture(req.user!.sub as string);
            res.json({message: "profile picture deleted", success: true});
        } catch (error) {
            next(error);
        }
    }
}

export default new UserController();
