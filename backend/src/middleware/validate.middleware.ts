import { Request, Response, NextFunction } from "express";
import { ZodObject, ZodError } from "zod";

type ValidationTarget = "body" | "params" | "query";

export const validate =
  <T extends ZodObject>(schema: T, target: ValidationTarget = "body") =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req[target]);

      req[target] = parsed as any;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        }));

        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors,
        });
      }

      next(error);
    }
  };
