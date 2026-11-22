import {NextFunction, Request, Response} from "express";
import {ZodType} from "zod";
import {AppError} from "../error/error";

interface Schemas {
    body?: ZodType;
    params?: ZodType;
    query?: ZodType;
}

export function validate(schemas: Schemas) {
    return (req: Request, res: Response, next: NextFunction): void => {
        const validated: Record<string, unknown> = {};
        for (const part of ['body', 'params', 'query'] as const) {
            const schema = schemas[part];
            if (!schema) continue;
            const result = schema.safeParse(req[part]);
            if (!result.success) {
                const message = result.error.issues
                    .map(issue => `${[part, ...issue.path].join('.')}: ${issue.message}`)
                    .join(', ');
                return next(new AppError(message, 400));
            }
            validated[part] = result.data;
        }
        res.locals.validated = validated;
        next();
    };
}
