import multer, {memoryStorage, Multer} from "multer";
import {RequestHandler} from "express";

export function multerUpload(): Multer {
    return multer({storage: memoryStorage()});
}

export function multerUploadSingle(fieldName: string): RequestHandler {
    return multerUpload().single(fieldName);
}

export function multerUploadArray(fieldName: string, maxCount: number): RequestHandler {
    return multerUpload().array(fieldName, maxCount);
}
