import { NextFunction, Request, Response } from "express";

export default function alreadyLoggedIn(req: Request, res: Response, next: NextFunction) {
    if (res.locals.user) {
        return res.status(401).json({message:"User is already logged in"});
    }
    return next();
}