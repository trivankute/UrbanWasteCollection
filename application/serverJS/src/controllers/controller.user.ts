import { PrismaClient } from "@prisma/client";
import { loginUserInput, registerUserInput } from "../schemas/schema.user";
import { hashPassword, verifyPassword } from "../utils/hash";
import { NextFunction, Request, Response } from "express";
import { signJwt } from "../utils/jwt.utils";


const registerHandle = async  (req: Request<{},{},Omit<registerUserInput,"confirmPassword">>, res: Response, next: NextFunction) =>{
        const prisma = new PrismaClient();
        const {name, email, password} = req.body;
        const {hash, salt} = hashPassword(password)
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hash,
                salt
            },
            select: {
                id: true,
                email: true,
                name: true
            }
        })
        res.status(201).json(newUser)
}

const loginHandle = async(req: Request<{},{},loginUserInput>, res: Response, next: NextFunction) => {
    const prisma = new PrismaClient();
    const {email, password:loginPassword} = req.body;
    const user = await prisma.user.findUnique({
        where: {
            email
        }
    })
    if(!user) {
        return res.status(404).json({message: "User not found"})
    }
    const isPasswordCorrect = verifyPassword({password:loginPassword, salt: user.salt, hash: user.password})
    if(!isPasswordCorrect) {
        return res.status(400).json({message: "Password is not correct"})
    }
    const { password, salt, ...rest } = user;
    const accessTokenTtl = "15m";
    const accessToken = signJwt(
        { ...rest},
        { expiresIn: accessTokenTtl }
    )
    res.status(200).json({accessToken, user: rest})
}

const getMeHandle = async(req: Request, res: Response, next: NextFunction) => {
    const prisma = new PrismaClient();
    const user = await prisma.user.findUnique({
        where: {
            id: res.locals.user.id
        }
    })
    if(!user) {
        return res.status(404).json({message: "User not found"})
    }
    const { password, salt, ...rest } = user;
    res.status(200).json(rest)
}

const logoutHandle = async(req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({message: "Logout successfully"})
}

export {
    registerHandle
    ,loginHandle,
    getMeHandle,
    logoutHandle
}