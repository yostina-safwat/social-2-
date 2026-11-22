import {Router} from "express";
import {authRouter} from "./app/auth/route";
import {userRouter} from "./app/user/route";
import {postRouter} from "./app/post/route";
import {commentRouter} from "./app/comment/route";

export const routes = Router();

routes.use('/auth', authRouter);
routes.use('/user', userRouter);
routes.use('/post', postRouter);
routes.use('/comment', commentRouter);
