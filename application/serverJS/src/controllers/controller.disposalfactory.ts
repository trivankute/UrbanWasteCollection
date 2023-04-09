import { NextFunction, Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import ExpressError from "../utils/expressError"
import prisma from "../utils/prisma"
import { disposalCreateInput, disposalGetInput } from "../schemas/schema.disposalfactory"

const createDisposalFactoryHandle = async (req: Request<{},{},disposalCreateInput>, res: Response, next: NextFunction) => {
    try{
        const disposal = await prisma.disposalFactory.create({
            data: { 
                name: req.body.name,
                addressPoint: req.body.addressPoint
            },
            select: {
                id: true,
                name: true,
                addressPoint: true
            }
        })
        res.status(201).json({status:"success", data: disposal})
    }
    catch(err) {
        next(new ExpressError('Cannot assign worker to vehicle', StatusCodes.INTERNAL_SERVER_ERROR))
    }
}

const getAllDisposalFactoryHandle = async (req: Request<{},{},{}>, res: Response, next: NextFunction) => {
    try{
        const allDisposal = await prisma.disposalFactory.findMany()
        res.status(200).json({status:"success", data: allDisposal})
    }
    catch(err) {
        next(new ExpressError('Cannot get all disposal factory', StatusCodes.INTERNAL_SERVER_ERROR))
    }
}

const getDisposalFactoryHandle = async (req: Request<disposalGetInput,{},{}>, res: Response, next: NextFunction) => {
    try{
        const {id} = req.params
        const disposal = await prisma.disposalFactory.findUnique({
            where: {
                id
            }
        })
        if(!disposal) {
            return res.status(404).json({status:"fail", message: "Disposal factory not found"})
        }
        res.status(200).json({status:"success", data: disposal})
    }
    catch(err) {
        next(new ExpressError('Cannot get disposal factory', StatusCodes.INTERNAL_SERVER_ERROR))
    }
}

export {
    createDisposalFactoryHandle,
    getAllDisposalFactoryHandle,
    getDisposalFactoryHandle
}