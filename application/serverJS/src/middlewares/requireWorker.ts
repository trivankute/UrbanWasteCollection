import { NextFunction, Request, Response } from "express";

export default function (req: Request, res: Response, next: NextFunction) {
    if (res.locals.user.role === "janitor" || res.locals.user.role === "collector") {
        return next();
    }
    return res.status(403).json({ status:"fail", message: "You are not workers" });
}