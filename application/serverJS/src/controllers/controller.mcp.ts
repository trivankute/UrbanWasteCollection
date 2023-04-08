import { NextFunction, Request, Response } from "express"
import { PrismaClient } from "@prisma/client";
import { mcpCreateInput } from "../schemas/schema.mcp";

const prisma = new PrismaClient();

const createMcpHandle = async (req:Request<{},{},mcpCreateInput>, res:Response, next: NextFunction) => {
    let {name, address} = req.body
    const newMCP = await prisma.mCP.create({
        data: {
            name,
            address
        },
        select: {
            id: true,
            name: true,
            address: true
        }
    })
    res.status(201).json(newMCP)
}

const getAllMcpHandle = async (req:Request, res:Response, next: NextFunction) => {
    const allMcps = await prisma.mCP.findMany()
    res.status(200).json(allMcps)
}

const getMcpHandle = async (req:Request, res:Response, next: NextFunction) => {
    const {id} = req.params
    const mcp = await prisma.mCP.findUnique({
        where: {
            id
        }
    })
    if(!mcp) {
        return res.status(404).json({message: "MCP not found"})
    }
    res.status(200).json(mcp)
}

export {
    createMcpHandle,
    getAllMcpHandle,
    getMcpHandle
}