import {Router} from "express";
import container from "../../lib/di/container";
import {TOKENS} from "../../lib/di/tokens";
import {AuthController} from "./controller/auth.controller";

const authController = container.resolve<AuthController>(TOKENS.AuthController);

export const authRouter = Router();

authRouter.post('/register', authController.register);
authRouter.post('/verify-account', authController.verifyAccount);
authRouter.post('/login', authController.login);
authRouter.post('/send-otp', authController.sendOtp);
authRouter.post('/reset-password', authController.resetPassword);
authRouter.post('/login-google', authController.loginWithGoogle);
authRouter.post('/refresh-token', authController.refreshToken);
