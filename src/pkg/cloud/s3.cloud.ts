import {DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client} from "@aws-sdk/client-s3";
import {ICloudProvider} from "./cloud.interface";

interface S3Config {
    region: string;
    accessKey: string;
    secretAccessKey: string;
    bucketName: string;
}

export class S3CloudProvider implements ICloudProvider {
    private client: S3Client;
    private readonly bucketName: string;

    constructor(config: S3Config) {
        this.client = new S3Client({
            region: config.region,
            credentials: {
                accessKeyId: config.accessKey,
                secretAccessKey: config.secretAccessKey
            }
        });
        this.bucketName = config.bucketName;
    }

    async uploadFile(file: Express.Multer.File, path: string): Promise<string> {
        const key = `${path}/${new Date().toISOString()}-${file.originalname}`;
        const command = new PutObjectCommand({
            Bucket: this.bucketName,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
        });
        await this.client.send(command);
        return key;
    }

    async getFile(key: string): Promise<Buffer> {
        const command = new GetObjectCommand({
            Bucket: this.bucketName,
            Key: key,
        });
        const response = await this.client.send(command);
        const bytes = await response.Body!.transformToByteArray();
        return Buffer.from(bytes);
    }

    async deleteFile(key: string): Promise<void> {
        const command = new DeleteObjectCommand({
            Bucket: this.bucketName,
            Key: key,
        });
        await this.client.send(command);
    }
}
