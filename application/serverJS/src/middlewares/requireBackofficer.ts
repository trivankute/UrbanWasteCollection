import { NextFunction, Request, Response } from "express";

export default function(req:Request, res:Response, next:NextFunction) {
    if (res.locals.user.role !== "backofficer") {
        return res.status(403).json({ status:"fail", message: "You are not backofficer" });
    }
    return next();
}