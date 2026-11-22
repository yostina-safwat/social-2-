import {TUserPayload} from "./userPayload.interface";

declare module 'express-serve-static-core' {
    interface Request {
        user?: TUserPayload;
    }
}
