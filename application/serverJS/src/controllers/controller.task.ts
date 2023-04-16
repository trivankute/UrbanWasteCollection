import { NextFunction, Request, Response } from "express"
import { backOfficerReviewTaskBodyInput, backOfficerReviewTaskParamsInput, createTaskInput, searchTaskInput, updateNeedReviewTaskInput } from "../schemas/schema.task"
import prisma from "../utils/prisma"
import ExpressError from "../utils/expressError"
import { StatusCodes } from "http-status-codes"
import { any } from "zod"

const createTaskHandle = async (req: Request<{}, {}, createTaskInput>, res: Response, next: NextFunction) => {
    try {
        // take out data from request body
        let { name, type, vehicleId, pathDisposalFactoriesIds, mcpId, mcpPreviousCapacity, routes } = req.body
        const vehicle = await prisma.vehicle.findUnique(
            {
                where: {
                    id: vehicleId
                },
                select: {
                    id: true,
                    workers: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                }
            }
        )

        if (!vehicle) {
            next(new ExpressError("Vehicle not found", StatusCodes.BAD_REQUEST))
        }
        // check is there any workers
        if (vehicle?.workers && vehicle?.workers.length <= 0) {
            next(new ExpressError("Vehicle has no workers", StatusCodes.BAD_REQUEST))
        }

        // update state of vehicle and workers
        const newVehicle = await prisma.vehicle.update({
            where: {
                id: vehicleId
            },
            data: {
                state: "in progress",
                workers: {
                    updateMany: {
                        data: {
                            state: "in progress"
                        },
                        where: {
                            vehicleId: vehicleId
                        }
                    }
                }
            },
            select: {
                id: true,
                currentDisposalFactoryId: true,
                workers: {
                    select: {
                        id: true,
                        state: true,
                        name: true,
                        role: true,
                    }
                }
            }
        })

        if (newVehicle.currentDisposalFactoryId !== pathDisposalFactoriesIds[0].id) {
            next(new ExpressError("Vehicle is not at the first disposal factory", StatusCodes.BAD_REQUEST))
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
                        currentDisposalFactory: true
                    }
                },
                routes: true,
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
    catch (err) {
        next(new ExpressError('Cannot create task', StatusCodes.INTERNAL_SERVER_ERROR))
    }
}

const updateNeedReviewTaskHandle = async (req: Request<updateNeedReviewTaskInput, {}, {}>, res: Response, next: NextFunction) => {
    // take out data from request body
    try {
        const { id } = req.params
        // find task first
        const task = await prisma.task.findUnique({
            where: {
                id: id
            },
            select: {
                id: true,
                state:true,
                vehicle: {
                    select: {
                        id: true,
                        currentDisposalFactoryId: true,
                        workers: {
                            select: {
                                id: true,
                                state: true,
                                name: true,
                                role: true,
                            }
                        }
                    }
                },
            }
        })
        // check if worker is in that task
        if (task?.vehicle && !task.vehicle.workers.some(worker => worker.id === res.locals.user.id)) {
            next(new ExpressError("You are not in this task", StatusCodes.FORBIDDEN))
        }
        // check if task is in need review state
        if (task!.state === "need review") {
            next(new ExpressError("Task is already in need review state", StatusCodes.BAD_REQUEST))
        }


        const newTask = await prisma.task.update({
            where: {
                id: id
            },
            data: {
                state: "need review"
            },
            select: {
                id: true,
                name: true,
                type: true,
                state: true,
                vehicle: {
                    select: {
                        id: true,
                        currentDisposalFactory: true
                    }
                },
                routes: true,
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
        res.status(200).json({ status: "success", data: newTask })
    }
    catch (err) {
        console.log(err)
        next(new ExpressError('Cannot update task', StatusCodes.INTERNAL_SERVER_ERROR))
    }
}

const answerNeedReviewTaskHandle = async (req: Request<{}, {}, createTaskInput>, res: Response, next: NextFunction) => {
    // take out data from request body
}

const searchTask = async (req: Request<{}, {}, searchTaskInput>, res: Response, next: NextFunction) => {
    // take out data from request body
    const { name, type, state, page, pageSize, disposalName, mcpName } = req.body
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
                        currentDisposalFactory: {
                            select: {
                                id: true,
                                name: true,
                            }
                        }
                    }
                },
                routes: true,
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
    catch (err) {
        next(new ExpressError("Cannot search task", StatusCodes.INTERNAL_SERVER_ERROR))
    }
}

const deleteTaskHandle = async (req: Request<{ id: string }, {}, {}>, res: Response, next: NextFunction) => {
    // take out data from request body
    const { id } = req.params
    try {
        let task = await prisma.task.findUnique({
            where: {
                id
            },
            select: {
                id: true,
                vehicle: {
                    select: {
                        id: true,
                    }
                },
                mcp: {
                    select: {
                        id: true,
                    }
                },
                disposalFactories: {
                    select: {
                        id: true,
                    }
                }
            }
        })
        if (!task) {
            next(new ExpressError("Cannot find task", StatusCodes.NOT_FOUND))
        }
        // remove all connections
        await prisma.task.update({
            where: {
                id
            },
            data: {
                disposalFactories: {
                    set:[]
                },
                vehicle: {
                    disconnect: true
                },
                mcp: {
                    disconnect: true
                }
            }
        })
        // delete tas

        const newTask = await prisma.task.delete({
            where: {
                id
            }
        })
        res.status(200).json({ status: "success", data: newTask })
    }
    catch (err) {
        console.log(err)
        next(new ExpressError("Cannot delete task", StatusCodes.INTERNAL_SERVER_ERROR))
    }
}

const backOfficerReviewTaskHandle = async (req: Request<backOfficerReviewTaskParamsInput, {}, backOfficerReviewTaskBodyInput>, res: Response, next: NextFunction) => {
    const {id} = req.params
    const {answer} = req.body
    try {
        // find task
        let task = await prisma.task.findUnique({
            where: {
                id
            },
            select: {
                id: true,
                state: true,
                accept: true,
                vehicle: {
                    select: {
                        id: true,
                    }
                },
                mcp: {
                    select: {
                        id: true,
                    }
                },
                disposalFactories: {
                    select: {
                        id: true,
                    }
                },
                mcpPreviousCapacity: true
            }
        })
        if (!task) {
            next(new ExpressError("Cannot find task", StatusCodes.NOT_FOUND))
        }
        if (task?.state !== "need review") {
            next(new ExpressError("Task is not in need review state", StatusCodes.BAD_REQUEST))
        }
        if (task?.accept === true) {
            next(new ExpressError("Task is accepted", StatusCodes.BAD_REQUEST))
        }

        // update task
        if(answer === "refuse")
        {
            await prisma.task.update({
                where: {
                    id
                },
                data: {
                    state: "in progress"
                }
            })
            res.status(200).json({ status: "success", data: "refuse" })
        }
        else if (answer === "accept"){
            // update fuel and capacity and currentDisposal equal new second disposal of task for vehicle
            await prisma.vehicle.update({
                where: {
                    id: task!.vehicle!.id
                },
                data: {
                    currentDisposalFactory: {
                        connect: {
                            id: task!.disposalFactories.length===1 ? task!.disposalFactories[0].id : task!.disposalFactories[1].id
                        }
                    },
                    fuel: {
                        decrement: 10
                    },
                    capacity: {
                        increment: 10
                    },
                    state : "nothing"
                },
            })
            // update capacity for mcp
            await prisma.mCP.update({
                where: {
                    id: task!.mcp!.id
                },
                data: {
                    capacity: {
                        decrement: 10
                    }
                }
            })
            // update state for task    
            await prisma.task.update({
                where: {
                    id
                },
                data: {
                    state: "done",
                    accept: true,
                    doneAt: new Date(),
                    mcpResultCapacity: task!.mcpPreviousCapacity! - 10

                }
            })
            task = await prisma.task.findUnique({
                where: {
                    id
                },
                select: {
                    id: true,
                    state: true,
                    accept: true,
                    vehicle: {
                        select: {
                            id: true,
                            currentDisposalFactory: {
                                select: {
                                    id: true,
                                    name: true,
                                }
                            },
                        }
                    },
                    mcp: {
                        select: {
                            id: true,
                            name: true
                        }
                    },
                    disposalFactories: {
                        select: {
                            id: true,
                            name: true
                        }
                    },
                    mcpPreviousCapacity: true,
                    mcpResultCapacity: true
                }
            })
            res.status(200).json({ status: "success", data: { message: "accept", task} })

        }
        else {
            next(new ExpressError("Answer is not valid", StatusCodes.BAD_REQUEST))
        }


    }
    catch (err) {
        next(new ExpressError("Cannot back officer review task", StatusCodes.INTERNAL_SERVER_ERROR))
    }

}

export {
    createTaskHandle,
    updateNeedReviewTaskHandle,
    answerNeedReviewTaskHandle,
    searchTask,
    deleteTaskHandle,
    backOfficerReviewTaskHandle
}