import { NextFunction, Request, Response } from "express"
import { z } from "zod"

const zodMiddlewares = (schema: z.ZodSchema<any>, type:"body"|"param"|"query") => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            if(type === "body") {
            await schema.parseAsync(req.body)
            } else if(type === "param") {
            await schema.parseAsync(req.params)
            } else if(type === "query") {
            await schema.parseAsync(req.query)
            }
            next()
        } catch (error) {
            let errors:any
            if (error instanceof z.ZodError) {
            errors = error.errors.map((err) => ({
                field: err.path.join('.'),
                message: err.message.replace(/_/g, ' '),
              }));
            }
            res.status(400).json({status:"fail", errors:  errors});
        }
    }
}

export default zodMiddlewares