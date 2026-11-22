import {Router} from "express";
import container from "../../lib/di/container";
import {TOKENS} from "../../lib/di/tokens";
import {PostController} from "./controller/post.controller";
import {authGuard} from "../../lib/auth/authGuard";
import {validate} from "../../lib/validation/validate";
import {withCache} from "../../lib/cache/withCache";
import {
    createPostSchema,
    paginationQuerySchema,
    postIdParamSchema,
    updatePostSchema
} from "./validation/post.validation";

const postController = container.resolve<PostController>(TOKENS.PostController);

export const postRouter = Router();

postRouter.use(authGuard);

postRouter.post('/', validate({body: createPostSchema}), postController.create);
postRouter.get('/', validate({query: paginationQuerySchema}), postController.getAll);
postRouter.get('/:id', validate({params: postIdParamSchema}), withCache(300), postController.getOne);
postRouter.patch('/:id', validate({params: postIdParamSchema, body: updatePostSchema}), postController.update);
postRouter.delete('/:id', validate({params: postIdParamSchema}), postController.remove);
