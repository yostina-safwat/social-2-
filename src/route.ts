import {Router} from "express";
import {authRouter} from "./app/auth/route";
import {userRouter} from "./app/user/route";

export const routes = Router();

routes.use('/auth', authRouter);
routes.use('/user', userRouter);
