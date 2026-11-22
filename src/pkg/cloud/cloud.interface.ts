export interface PresignedFileInfo {
    mimetype: string;
    originalname: string;
}

export interface ICloudProvider {
    uploadFile(file: Express.Multer.File, path: string): Promise<string>;

    getFile(key: string): Promise<Buffer>;

    deleteFile(key: string): Promise<void>;

    generatePresignedUrl(file: PresignedFileInfo, path: string): Promise<string>;
}
