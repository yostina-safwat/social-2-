import {Router} from "express";
import container from "../../lib/di/container";
import {TOKENS} from "../../lib/di/tokens";
import {CommentController} from "./controller/comment.controller";
import {authGuard} from "../../lib/auth/authGuard";
import {validate} from "../../lib/validation/validate";
import {
    commentIdParamSchema,
    createCommentSchema,
    paginationQuerySchema,
    postIdParamSchema,
    updateCommentSchema
} from "./validation/comment.validation";

const commentController = container.resolve<CommentController>(TOKENS.CommentController);

export const commentRouter = Router();

commentRouter.use(authGuard);

commentRouter.post('/', validate({body: createCommentSchema}), commentController.create);
commentRouter.get('/post/:postId', validate({params: postIdParamSchema, query: paginationQuerySchema}), commentController.getByPost);
commentRouter.get('/:id', validate({params: commentIdParamSchema}), commentController.getOne);
commentRouter.patch('/:id', validate({params: commentIdParamSchema, body: updateCommentSchema}), commentController.update);
commentRouter.delete('/:id', validate({params: commentIdParamSchema}), commentController.remove);
