import { NextFunction, Request, Response } from "express";

export default async function requireUser(req: Request, res: Response, next: NextFunction) {
    if (!res.locals.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    return next();
}