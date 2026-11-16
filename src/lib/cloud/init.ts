import {S3CloudProvider} from "../../pkg/cloud/s3.cloud";
import {LocalCloudProvider} from "../../pkg/cloud/local.cloud";
import {ICloudProvider} from "../../pkg/cloud/cloud.interface";
import {env} from "../config/env";

function createCloudProvider(): ICloudProvider {
    if (env.cloudProvider === 's3') {
        return new S3CloudProvider({
            region: env.aws.region,
            secretAccessKey: env.aws.secretKey,
            accessKey: env.aws.accessKey,
            bucketName: env.aws.bucketName,
        });
    }
    return new LocalCloudProvider('uploads');
}

export const cloudProvider = createCloudProvider();
