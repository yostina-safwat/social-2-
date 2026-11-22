import {z} from "zod";
import {objectIdSchema, paginationQuerySchema} from "../../../lib/validation/common";

export const createCommentSchema = z.object({
    postId: objectIdSchema,
    content: z.string().trim().min(1).max(1000),
    parentId: objectIdSchema.optional(),
});

export const updateCommentSchema = z.object({
    content: z.string().trim().min(1).max(1000),
});

export const commentIdParamSchema = z.object({id: objectIdSchema});

export const postIdParamSchema = z.object({postId: objectIdSchema});

export {paginationQuerySchema};
