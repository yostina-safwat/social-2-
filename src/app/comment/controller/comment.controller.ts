import {NextFunction, Request, Response} from "express";
import {inject, injectable} from "tsyringe";
import {TOKENS} from "../../../lib/di/tokens";
import {CommentService} from "../service/comment.service";
import {getUserId} from "../../../lib/utils/auth-user";

@injectable()
export class CommentController {
    constructor(@inject(TOKENS.CommentService) private readonly commentService: CommentService) {
    }

    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const comment = await this.commentService.createComment(getUserId(req), res.locals.validated.body);
            res.status(201).json({message: "comment created successfully", success: true, data: comment});
        } catch (error) {
            next(error);
        }
    }

    getByPost = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {params, query} = res.locals.validated;
            const data = await this.commentService.getPostComments(params.postId, query);
            res.json({message: "comments fetched successfully", success: true, data});
        } catch (error) {
            next(error);
        }
    }

    getOne = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const comment = await this.commentService.getCommentById(res.locals.validated.params.id);
            res.json({message: "comment fetched successfully", success: true, data: comment});
        } catch (error) {
            next(error);
        }
    }

    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {params, body} = res.locals.validated;
            const comment = await this.commentService.updateComment(params.id, getUserId(req), body);
            res.json({message: "comment updated successfully", success: true, data: comment});
        } catch (error) {
            next(error);
        }
    }

    remove = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await this.commentService.deleteComment(res.locals.validated.params.id, getUserId(req));
            res.json({message: "comment deleted successfully", success: true});
        } catch (error) {
            next(error);
        }
    }
}
