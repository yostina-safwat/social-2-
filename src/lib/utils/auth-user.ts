import {Request} from "express";
import {AppError} from "../error/error";

export function getUserId(req: Request): string {
    const userId = req.user?.sub;
    if (!userId) throw new AppError('no token provided', 403);
    return userId;
}
