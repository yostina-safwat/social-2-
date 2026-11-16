import {config} from "dotenv";
import {z} from "zod";

config();

const schema = z.object({
    PORT: z.string().default('3000'),
    MONGODB_URL: z.string(),
    JWT_ACCESS_SECRET: z.string(),
    JWT_REFRESH_SECRET: z.string(),
    MAIL_USER: z.string().trim().toLowerCase(),
    MAIL_PASSWORD: z.string(),
    GOOGLE_WEB_OAUTH_CLIENT_ID: z.string(),
    REDIS_PORT: z.string().default('6379'),
    REDIS_HOST: z.string(),
    REDIS_PASSWORD: z.string().default(''),
    MAILJET_API_KEY: z.string().default(''),
    MAILJET_API_SECRET: z.string().default(''),
    MAILJET_FROM_EMAIL: z.string().default(''),
    MAILJET_FROM_NAME: z.string().default(''),
    CLOUD_PROVIDER: z.enum(['local', 's3']).default('local'),
    S3_ACCESS_KEY: z.string().default(''),
    S3_SECRET_KEY: z.string().default(''),
    S3_REGION: z.string().default(''),
    S3_BUCKET_NAME: z.string().default(''),
});

const parsed = schema.parse(process.env);

if (parsed.CLOUD_PROVIDER === 's3' && !(parsed.S3_ACCESS_KEY && parsed.S3_SECRET_KEY && parsed.S3_REGION && parsed.S3_BUCKET_NAME)) {
    throw new Error('CLOUD_PROVIDER=s3 needs S3_ACCESS_KEY, S3_SECRET_KEY, S3_REGION and S3_BUCKET_NAME');
}

export const env = {
    port: Number(parsed.PORT),
    db: {
        url: parsed.MONGODB_URL,
    },
    redis: {
        host: parsed.REDIS_HOST,
        port: Number(parsed.REDIS_PORT),
        password: parsed.REDIS_PASSWORD,
    },
    nodemailer: {
        host: 'smtp.gmail.com',
        port: 587,
        user: parsed.MAIL_USER,
        pass: parsed.MAIL_PASSWORD,
        fromEmail: parsed.MAIL_USER,
    },
    mailjet: {
        apiKey: parsed.MAILJET_API_KEY,
        apiSecret: parsed.MAILJET_API_SECRET,
        fromEmail: parsed.MAILJET_FROM_EMAIL,
        fromName: parsed.MAILJET_FROM_NAME,
    },
    jwt: {
        accessSecret: parsed.JWT_ACCESS_SECRET,
        refreshSecret: parsed.JWT_REFRESH_SECRET
    },
    cloudProvider: parsed.CLOUD_PROVIDER,
    aws: {
        accessKey: parsed.S3_ACCESS_KEY,
        secretKey: parsed.S3_SECRET_KEY,
        region: parsed.S3_REGION,
        bucketName: parsed.S3_BUCKET_NAME,
    },
    google: {
        webClientId: parsed.GOOGLE_WEB_OAUTH_CLIENT_ID,
    },
};
