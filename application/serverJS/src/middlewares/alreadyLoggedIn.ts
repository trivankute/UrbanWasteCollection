import { NextFunction, Request, Response } from "express";

export default async function alreadyLoggedIn(req: Request, res: Response, next: NextFunction) {
    if (res.locals.user) {
        return res.status(401).json({ status:"fail", message:"User is already logged in"});
    }
    return next();
}