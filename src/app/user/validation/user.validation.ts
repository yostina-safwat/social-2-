import {z} from "zod";

export const presignedUrlSchema = z.object({
    fileName: z.string().trim().min(1).max(200).regex(/^[^\\/]+$/, 'file name must not contain slashes'),
    contentType: z.string().regex(/^image\/[a-z0-9.+-]+$/i, 'content type must be an image'),
});
