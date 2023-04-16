import { loginUserInput, registerUserInput, searchUserInput, updateProfileInput, updateRoleInput } from "../schemas/schema.user";
import { hashPassword, verifyPassword } from "../utils/hash";
import { NextFunction, Request, Response } from "express";
import { signJwt } from "../utils/jwt.utils";
import prisma from "../utils/prisma";
import ExpressError from "../utils/expressError";
import { StatusCodes } from "http-status-codes";


const registerHandle = async (req: Request<{}, {}, Omit<registerUserInput, "confirmPassword">>, res: Response, next: NextFunction) => {
    try {
        const { name, email, password } = req.body;
        const { role, disposalId } = req.query
        const { hash, salt } = hashPassword(password)
        if (role && disposalId) {
            const newUser = await prisma.user.create({
                data: {
                    name,
                    email,
                    password: hash,
                    salt,
                    role: role as string,
                    disposalFactory: {
                        connect: {
                            id: disposalId as string
                        }
                    }
                },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true,
                    disposalFactory: true
                }
            })
            res.json({ status: "success", message: "User registered successfully" })
        }
        else {
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
            res.json({ status: "success", message: "User registered successfully" })
        }
    }
    catch (err) {
        next(new ExpressError("Cannot register", StatusCodes.INTERNAL_SERVER_ERROR))
    }
}

const loginHandle = async (req: Request<{}, {}, loginUserInput>, res: Response, next: NextFunction) => {
    try {
        const { email, password: loginPassword } = req.body;
        const user = await prisma.user.findUnique({
            where: {
                email
            },
            include: {
                disposalFactory: {
                    select: {
                        name: true,
                    }
                }
            }
        })
        if (!user) {
            return res.status(404).json({ status: "fail", message: "User not found" })
        }
        const isPasswordCorrect = verifyPassword({ password: loginPassword, salt: user.salt, hash: user.password })
        if (!isPasswordCorrect) {
            return res.status(400).json({ status: "fail", message: "Password is not correct" })
        }
        const { password, salt, ...rest } = user;
        const accessTokenTtl = "15m";
        const accessToken = signJwt(
            { ...rest },
            { expiresIn: accessTokenTtl }
        )
        res.status(200).json({ status: "success", accessToken, user: rest })
    }
    catch (err) {
        next(new ExpressError("Cannot login", StatusCodes.INTERNAL_SERVER_ERROR))
    }
}

const getMeHandle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: res.locals.user.id
            },
            include: {
                disposalFactory: {
                    select: {
                        name: true,
                    }
                }
            }
        })
        if (!user) {
            return res.status(404).json({ status: "fail", message: "User not found" })
        }
        const { password, salt, ...rest } = user;
        res.status(200).json({ status: "success", user: rest })
    }
    catch (err) {
        next(new ExpressError("Cannot get user", StatusCodes.INTERNAL_SERVER_ERROR))
    }
}

const logoutHandle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.status(200).json({ status: "success", message: "Logout successfully" })
    }
    catch (err) {
        next(new ExpressError("Cannot logout", StatusCodes.INTERNAL_SERVER_ERROR))
    }
}

const updateRoleHandle = async (req: Request<{}, {}, updateRoleInput>, res: Response, next: NextFunction) => {
    try {
        const { id, role } = req.body;
        const user = await prisma.user.update({
            where: {
                id
            },
            data: {
                role
            }
        })
        if (!user) {
            return res.status(404).json({ status: "fail", message: "User not found" })
        }
        else
            res.status(200).json({ status: "success", data: user })
    }
    catch (err) {
        next(new ExpressError("Cannot update role", StatusCodes.INTERNAL_SERVER_ERROR))
    }
}

const searchUserHandle = async (req: Request<{}, {}, searchUserInput>, res: Response, next: NextFunction) => {
    try {
        const { name, role, page, pageSize, disposalName, state } = req.body;
        let user = await prisma.user.findMany({
            take: pageSize as number,
            skip: (page as number - 1) * pageSize as number,
            where: {
                name: {
                    contains: name as string
                },
                role: {
                    contains: role as string
                },
                disposalFactory: {
                    name: {
                        contains: disposalName as string
                    }
                },
                state: {
                    contains: state as string
                },
            },
            include: {
                vehicle:{
                    include: {
                        task: true
                    }
                }
            }
        })

        // select the user
        let userSelect = user.map((item) => {
            const { password, salt, ...rest } = item;
            return rest
        })
        if (!userSelect) {
            return res.status(404).json({ status: "fail", message: "User not found" })
        }
        else
            res.status(200).json({ status: "success", data: userSelect })
    }
    catch (err) {
        next(new ExpressError("Cannot search user", StatusCodes.INTERNAL_SERVER_ERROR))
    }
}

const updateProfileHandle = async (req: Request<{}, {}, updateProfileInput>, res: Response, next: NextFunction) => {
    try {
        let path
        if (req.file) {
            path = req.file.path
        }
        else {
            path = res.locals.image
        }
        let {
            name,
            age,
            address,
            phone,
            nationality,
            birthday,
            gender } = req.body;
        // age to int
        let correctAge: number = parseInt(age as string)

        const user = await prisma.user.update({
            where: {
                id: res.locals.user.id
            },
            data: {
                name,
                age: correctAge as number,
                address,
                phone,
                nationality,
                birthday,
                gender,
                image: path
            }
        })
        if (!user) {
            return res.status(404).json({ status: "fail", message: "User not found" })
        }
        else
            res.status(200).json({ status: "success", data: user })
    }
    catch (err) {
        next(new ExpressError("Cannot update profile", StatusCodes.INTERNAL_SERVER_ERROR))
    }
}

const checkinHandle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = res.locals.user.id;
        // find user first
        const user = await prisma.user.findUnique({
            where: {
                id
            },
            select: {
                checkin: true,
                checkinTime: true,
                checkout: true,
                checkoutTime: true
            }
        })
        if (!user) {
            return res.status(404).json({ status: "fail", message: "User not found" })
        }
        if (user.checkin) {
            return res.status(400).json({ status: "fail", message: "You have already checked in" })
        }
        if (user.checkout) {
            return res.status(400).json({ status: "fail", message: "You have already checked out" })
        }
        // update user
        const newUser = await prisma.user.update({
            where: {
                id
            },
            data: {
                checkin: true,
                checkinTime: new Date()
            },
            select:
            {
                id: true,
                email: true,
                name: true,
                checkin: true,
                checkinTime: true,
            }
        })
        res.status(200).json({ status: "success", data: newUser })
    }
    catch (err) {
        next(new ExpressError("Cannot checkin", StatusCodes.INTERNAL_SERVER_ERROR))
    }
}

const checkoutHandle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = res.locals.user.id;
        // find user first
        const user = await prisma.user.findUnique({
            where: {
                id
            },
            select: {
                checkin: true,
                checkinTime: true,
                checkout: true,
                checkoutTime: true
            }
        })
        if (!user) {
            return res.status(404).json({ status: "fail", message: "User not found" })
        }
        if (!user.checkin) {
            return res.status(400).json({ status: "fail", message: "User has not checked in" })
        }
        if (user.checkout) {
            return res.status(400).json({ status: "fail", message: "User has already checked out" })
        }
        // not enough 8 hours
        if (new Date().getTime() - user.checkinTime!.getTime() < 8 * 60 * 60 * 1000) {
            return res.status(400).json({ status: "fail", message: "User has not worked 8 hours" })
        }
        // update user
        const newUser = await prisma.user.update({
            where: {
                id
            },
            data: {
                checkout: true,
                checkoutTime: new Date()
            },
            select:
            {
                id: true,
                email: true,
                name: true,
                checkin: true,
                checkinTime: true,
                checkout: true,
                checkoutTime: true,
            }
        })
        res.status(200).json({ status: "success", data: newUser })
    }
    catch (err) {
        next(new ExpressError("Cannot checkout", StatusCodes.INTERNAL_SERVER_ERROR))
    }
}

const resetcheckincheckoutHandle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = res.locals.user.id;
        // find user first
        const user = await prisma.user.findUnique({
            where: {
                id
            },
            select: {
                checkin: true,
                checkinTime: true,
                checkout: true,
                checkoutTime: true
            }
        })
        if (!user) {
            return res.status(404).json({ status: "fail", message: "User not found" })
        }
        if (!user.checkin) {
            return res.status(400).json({ status: "fail", message: "User has not checked in" })
        }
        if (!user.checkout) {
            return res.status(400).json({ status: "fail", message: "User has not checked out" })
        }

        // update user
        const newUser = await prisma.user.update({
            where: {
                id
            },
            data: {
                checkin: false,
                checkinTime: null,
                checkout: false,
                checkoutTime: null
            },
            select:
            {
                id: true,
                email: true,
                name: true,
                checkin: true,
                checkinTime: true,
                checkout: true,
                checkoutTime: true,
            }
        })
        res.status(200).json({ status: "success", data: newUser })
    }
    catch (error) {
        next(new ExpressError("Cannot reset checkin checkout", StatusCodes.INTERNAL_SERVER_ERROR))
    }
}


export {
    registerHandle
    , loginHandle,
    getMeHandle,
    logoutHandle,
    updateRoleHandle,
    searchUserHandle,
    updateProfileHandle,
    checkinHandle,
    checkoutHandle,
    resetcheckincheckoutHandle
}