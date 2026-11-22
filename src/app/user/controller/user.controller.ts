import {NextFunction, Request, Response} from "express";
import {inject, injectable} from "tsyringe";
import {TOKENS} from "../../../lib/di/tokens";
import {UserService} from "../service/user.service";
import {AppError} from "../../../lib/error/error";
import {getUserId} from "../../../lib/utils/auth-user";

@injectable()
export class UserController {
    constructor(@inject(TOKENS.UserService) private readonly userService: UserService) {
    }

    uploadProfilePicture = async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.file) throw new AppError('no file provided', 400);
            await this.userService.uploadProfilePicture(req.file, getUserId(req));
            res.json({message: "profile picture uploaded", success: true});
        } catch (error) {
            next(error);
        }
    }

    generatePresignedUrl = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const url = await this.userService.generatePresignedUrl(res.locals.validated.body, getUserId(req));
            res.json({message: "presigned url generated", success: true, data: {url}});
        } catch (error) {
            next(error);
        }
    }

    deleteProfilePic = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await this.userService.deleteProfilePicture(getUserId(req));
            res.json({message: "profile picture deleted", success: true});
        } catch (error) {
            next(error);
        }
    }
}
