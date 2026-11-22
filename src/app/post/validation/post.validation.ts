import {z} from "zod";
import {objectIdSchema, paginationQuerySchema} from "../../../lib/validation/common";

export const createPostSchema = z.object({
    content: z.string().trim().min(1).max(2000),
    allowsComments: z.boolean().optional(),
});

export const updatePostSchema = z.object({
    content: z.string().trim().min(1).max(2000).optional(),
    allowsComments: z.boolean().optional(),
}).refine(data => Object.keys(data).length > 0, {message: 'send at least one field to update'});

export const postIdParamSchema = z.object({id: objectIdSchema});

export {paginationQuerySchema};
