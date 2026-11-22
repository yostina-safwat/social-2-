import {AppError} from "../../lib/error/error";

export const commentNotFound = new AppError('Comment Not Found.', 404);
export const notCommentOwner = new AppError('You are not allowed to modify this comment.', 403);
export const notAllowedToDeleteComment = new AppError('Only the comment owner or the post owner can delete this comment.', 403);
export const commentsDisabled = new AppError('Comments are disabled on this post.', 403);
export const invalidParentComment = new AppError('Parent comment is invalid.', 400);
