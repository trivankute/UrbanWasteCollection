import { NextFunction, Request, Response } from "express"
import { createTaskInput, searchTaskInput } from "../schemas/schema.task"
import prisma from "../utils/prisma"
import ExpressError from "../utils/expressError"
import { StatusCodes } from "http-status-codes"

const createTaskHandle = async (req: Request<{},{},createTaskInput>, res: Response, next: NextFunction) => {
    try
    {
        // take out data from request body
        let { name, type, vehicleId, pathDisposalFactoriesIds, mcpId, mcpPreviousCapacity, routes} = req.body
        // update state of vehicle and workers
        const vehicle = await prisma.vehicle.update({
            where: {
                id: vehicleId
            },
            data: {
                state: "In progress",
                workers: {
                    updateMany: {
                        data: {
                            state: "In progress"
                        },
                        where: {
                            vehicleId: vehicleId
                        }
                    }
                }
            }
        })
        if(vehicle.currentDisposalFactoryId !== pathDisposalFactoriesIds[0].id) {
            throw new ExpressError("Vehicle is not at the first disposal factory", StatusCodes.BAD_REQUEST)
        }
    
        // create task
        const newTask = await prisma.task.create({
            data: {
                name,
                type,
                vehicle: {
                    connect: {
                        id: vehicleId
                    }
                },
                disposalFactories: {
                    connect: pathDisposalFactoriesIds
                },
                routes,
                mcp: {
                    connect: {
                        id: mcpId
                    }
                },
                mcpPreviousCapacity
            },
            select: {
                id: true,
                name: true,
                type: true,
                vehicle: {
                    select: {
                        id: true,
                        currentDisposalFactory:true
                    }
                },
                routes:true,
                disposalFactories: {
                    select: {
                        id: true,
                        name: true,
                        addressPoint: true,
                    }
                },
                mcp: {
                    select: {
                        id: true,
                        name: true,
                        addressPoint: true,
                }
                },
                mcpPreviousCapacity: true,
            }
        })
        res.status(201).json({ status: "success", data: newTask })
    }
    catch(err)
    {        
        next(new ExpressError('Cannot create task', StatusCodes.INTERNAL_SERVER_ERROR))
    }
}

const updateStateTaskHandle = async (req: Request<{},{},{}>, res: Response, next: NextFunction) => {
    // take out data from request body
}

const answerNeedReviewTaskHandle = async (req: Request<{},{},createTaskInput>, res: Response, next: NextFunction) => {
    // take out data from request body
}

const searchTask = async (req: Request<{},{}, searchTaskInput>, res: Response, next: NextFunction) => {
    // take out data from request body
    const { name, type, state, page, pageSize, disposalName, mcpName} = req.body
    try {
        const tasks = await prisma.task.findMany({
            skip: (page - 1) * pageSize,
            take: pageSize,
            where: {
                name: {
                    contains: name
                },
                type,
                state,
                disposalFactories: {
                    some: {
                        name: {
                            contains: disposalName as string
                        }
                    }
                },
                mcp: {
                    name: {
                        contains: mcpName
                    }
                }
            },
            select: {
                id: true,
                name: true,
                type: true,
                state: true,
                vehicle: {
                    select: {
                        id: true,
                        currentDisposalFactory:{
                            select: {
                                id: true,
                                name: true,
                        }
                    }
                }
                },
                routes:true,
                disposalFactories: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
                mcp: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
                mcpPreviousCapacity: true,
            }
        })
        res.status(200).json({ status: "success", data: tasks })
    }
    catch(err)
    {
        next(new ExpressError("Cannot search task", StatusCodes.INTERNAL_SERVER_ERROR))
    }
}

const deleteTaskHandle = async (req: Request<{id:string},{},{}>, res: Response, next: NextFunction) => {
    // take out data from request body
    const {id} = req.params
    try {
        const task = await prisma.task.delete({
            where: {
                id
            }
        })
        res.status(200).json({ status: "success", data: task })
    }
    catch(err)
    {
        next(new ExpressError("Cannot delete task", StatusCodes.INTERNAL_SERVER_ERROR))
    }
}

export {
    createTaskHandle,
    updateStateTaskHandle,
    answerNeedReviewTaskHandle,
    searchTask,
    deleteTaskHandle
}