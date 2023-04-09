import { NextFunction, Request, Response } from "express"
import { mcpCreateInput } from "../schemas/schema.mcp";
import prisma from "../utils/prisma";
import ExpressError from "../utils/expressError";
import { StatusCodes } from "http-status-codes";


const createMcpHandle = async (req:Request<{},{},mcpCreateInput>, res:Response, next: NextFunction) => {
    try {
        let {name, addressPoint} = req.body
        const newMCP = await prisma.mCP.create({
            data: {
                name,
                addressPoint
            },
            select: {
                id: true,
                name: true,
                addressPoint: true
            }
        })
        res.status(201).json({status:"success", data: newMCP})
    }
    catch(err) {
        next(new ExpressError('Cannot create MCP', StatusCodes.INTERNAL_SERVER_ERROR))
    }
}

const getAllMcpHandle = async (req:Request, res:Response, next: NextFunction) => {
    try {
        const allMcps = await prisma.mCP.findMany()
        res.status(200).json({status:"success", data: allMcps})
    }
    catch(err) {
        next(new ExpressError('Cannot get all MCP', StatusCodes.INTERNAL_SERVER_ERROR))
    }
}

const getMcpHandle = async (req:Request, res:Response, next: NextFunction) => {
    try {
        const {id} = req.params
        const mcp = await prisma.mCP.findUnique({
            where: {
                id
            }
        })
        if(!mcp) {
            return res.status(404).json({status:"fail", message: "MCP not found"})
        }
        res.status(200).json({status:"success", data: mcp})
    }
    catch(err) {
        next(new ExpressError('Cannot get MCP', StatusCodes.INTERNAL_SERVER_ERROR))
    }
}

export {
    createMcpHandle,
    getAllMcpHandle,
    getMcpHandle
}