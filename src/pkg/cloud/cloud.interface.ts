// contract for cloud storage
// dependency injection

// file-information >> {originalname, mimetype, size, buffer}
export interface ICloudProvider {
    // return key
    uploadFile(file: Express.Multer.File, path: string): Promise<string>;

    getFile(key: string): Promise<Buffer>;

    deleteFile(key: string): Promise<void>;
}
