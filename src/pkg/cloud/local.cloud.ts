import {mkdir, readFile, rm, writeFile} from "node:fs/promises";
import path from "node:path";
import {ICloudProvider} from "./cloud.interface";

// stores the files on the server disk, useful for development without an S3 bucket
export class LocalCloudProvider implements ICloudProvider {
    private readonly rootDir: string;

    constructor(rootDir: string) {
        this.rootDir = path.resolve(rootDir);
    }

    async uploadFile(file: Express.Multer.File, folder: string): Promise<string> {
        // ":" is not allowed in file names on Windows
        const stamp = new Date().toISOString().replace(/:/g, '-');
        const key = `${folder}/${stamp}-${path.basename(file.originalname)}`;
        const fullPath = this.resolveKey(key);
        await mkdir(path.dirname(fullPath), {recursive: true});
        await writeFile(fullPath, file.buffer);
        return key;
    }

    async getFile(key: string): Promise<Buffer> {
        return readFile(this.resolveKey(key));
    }

    async deleteFile(key: string): Promise<void> {
        await rm(this.resolveKey(key), {force: true});
    }

    // make sure a key can never point outside the root folder
    private resolveKey(key: string): string {
        const fullPath = path.resolve(this.rootDir, key);
        if (!fullPath.startsWith(this.rootDir + path.sep)) {
            throw new Error('invalid file key');
        }
        return fullPath;
    }
}
