import {AppError} from "../../lib/error/error";

export const postNotFound = new AppError('Post Not Found.', 404);
export const notPostOwner = new AppError('You are not allowed to modify this post.', 403);
