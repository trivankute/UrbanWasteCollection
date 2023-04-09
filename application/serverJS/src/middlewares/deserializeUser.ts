import { NextFunction, Request, Response } from "express";
import _ from 'lodash'
import { verifyJwt } from "../utils/jwt.utils";

async function deserializeUser(req: Request, res: Response, next: NextFunction) {
    const accessToken =  _.get(req, "headers.authorization", "").replace(
        /^Bearer\s/,
        ""
        );
    if (!accessToken) {
        return next();
    }
    try {
        const { decoded , expired } = await verifyJwt(accessToken);
        if (expired) {
            return next();
        }
        if(decoded) {
            res.locals.user = decoded
        }
    }
    catch (err: any) {
        return res.status(401).json({ status:"fail", message: "Unauthorized" });
    }
    return next();
}

export default deserializeUser