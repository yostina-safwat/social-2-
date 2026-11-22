import {NextFunction, Request, Response} from "express";
import {inject, injectable} from "tsyringe";
import {TOKENS} from "../../../lib/di/tokens";
import {PostService} from "../service/post.service";
import {getUserId} from "../../../lib/utils/auth-user";

@injectable()
export class PostController {
    constructor(@inject(TOKENS.PostService) private readonly postService: PostService) {
    }

    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const post = await this.postService.createPost(getUserId(req), res.locals.validated.body);
            res.status(201).json({message: "post created successfully", success: true, data: post});
        } catch (error) {
            next(error);
        }
    }

    getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await this.postService.getUserPosts(getUserId(req), res.locals.validated.query);
            res.json({message: "posts fetched successfully", success: true, data});
        } catch (error) {
            next(error);
        }
    }

    getOne = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const post = await this.postService.getPostById(res.locals.validated.params.id);
            res.json({message: "post fetched successfully", success: true, data: post});
        } catch (error) {
            next(error);
        }
    }

    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const post = await this.postService.updatePost(res.locals.validated.params.id, getUserId(req), res.locals.validated.body);
            res.json({message: "post updated successfully", success: true, data: post});
        } catch (error) {
            next(error);
        }
    }

    remove = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await this.postService.deletePost(res.locals.validated.params.id, getUserId(req));
            res.json({message: "post deleted successfully", success: true});
        } catch (error) {
            next(error);
        }
    }
}
