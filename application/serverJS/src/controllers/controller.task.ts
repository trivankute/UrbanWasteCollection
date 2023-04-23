import { NextFunction, Request, Response } from "express"
import { backOfficerReviewTaskBodyInput, backOfficerReviewTaskParamsInput, createTaskInput, searchTasksInput, updateNeedReviewTaskInput } from "../schemas/schema.task"
import prisma from "../utils/prisma"
import ExpressError from "../utils/expressError"
import { StatusCodes } from "http-status-codes"

const createTaskHandle = async (req: Request<{}, {}, createTaskInput>, res: Response, next: NextFunction) => {
    try {
        // take out data from request body
        let { name, type, vehicleId, pathDisposalFactoriesIds, mcpIds, routes, createdTime } = req.body
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
                    },
                    currentDisposalFactoryId: true
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

        if (vehicle!.currentDisposalFactoryId !== pathDisposalFactoriesIds[0].id) {
            next(new ExpressError("Vehicle is not at the first disposal factory", StatusCodes.BAD_REQUEST))
        }

        // find mcps
        const mcps = await prisma.mCP.findMany({
            where: {
                id: {
                    in: mcpIds
                }
            },
        })
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


        if (!mcp) {
            next(new ExpressError("Mcp not found", StatusCodes.BAD_REQUEST))
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
                createdAt: createdTime,
                mcpPreviousCapacity: mcp?.capacity,
            },
            select: {
                id: true,
                name: true,
                type: true,
                state: true,
                vehicle: {
                    select: {
                        "id": true,
                        "numberPlate": true,
                        "maxWorkerSlot": true,
                        "capacity": true,
                        "fuel": true,
                        "state": true,
                        "type": true,
                        "currentMovingPointIndex": true,
                        "currentDisposalFactoryId": true,
                        "createdAt": true,
                        "updatedAt": true,
                        "workers": {
                            "select": {
                                "id": true,
                                "name": true,
                                "age": true,
                                role: true,
                                "state": true,
                                "image": true
                            }
                        }
                    }
                },
                routes: true,
                disposalFactories: true,
                mcp: true,
                mcpPreviousCapacity: true,
                mcpResultCapacity: true,
                accept: true,
                createdAt: true, updatedAt: true, doneAt: true,
            }
        })
        res.status(201).json({ status: "success", data: newTask })
    }
    catch (err) {
        console.log(err)
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
                state: true,
                type: true,
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
                mcpPreviousCapacity: true,
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

        let newTask
        if (task!.type === "collector") {
            newTask = await prisma.task.update({
                where: {
                    id: id
                },
                data: {
                    state: "need review",
                    mcpResultCapacity: task!.mcpPreviousCapacity === 100 ? 100 : task!.mcpPreviousCapacity! + 10
                },
                select: {
                    id: true,
                    name: true,
                    type: true,
                    state: true,
                    vehicle: {
                        select: {
                            "id": true,
                            "numberPlate": true,
                            "maxWorkerSlot": true,
                            "capacity": true,
                            "fuel": true,
                            "state": true,
                            "type": true,
                            "currentMovingPointIndex": true,
                            "currentDisposalFactoryId": true,
                            "createdAt": true,
                            "updatedAt": true,
                            "workers": {
                                "select": {
                                    "id": true,
                                    "name": true,
                                    "age": true,
                                    role: true,
                                    "state": true,
                                    "image": true
                                }
                            }
                        }
                    },
                    routes: true,
                    disposalFactories: true,
                    mcp: true,
                    mcpPreviousCapacity: true,
                    mcpResultCapacity: true,
                    accept: true,
                    createdAt: true, updatedAt: true, doneAt: true,
                }
            })
        }
        else {
            newTask = await prisma.task.update({
                where: {
                    id: id
                },
                data: {
                    state: "need review",
                    mcpResultCapacity: task!.mcpPreviousCapacity === 0 ? 0 : task!.mcpPreviousCapacity! - 10
                },
                select: {
                    id: true,
                    name: true,
                    type: true,
                    state: true,
                    vehicle: {
                        select: {
                            "id": true,
                            "numberPlate": true,
                            "maxWorkerSlot": true,
                            "capacity": true,
                            "fuel": true,
                            "state": true,
                            "type": true,
                            "currentMovingPointIndex": true,
                            "currentDisposalFactoryId": true,
                            "createdAt": true,
                            "updatedAt": true,
                            "workers": {
                                "select": {
                                    "id": true,
                                    "name": true,
                                    "age": true,
                                    role: true,
                                    "state": true,
                                    "image": true
                                }
                            }
                        }
                    },
                    routes: true,
                    disposalFactories: true,
                    mcp: true,
                    mcpPreviousCapacity: true,
                    mcpResultCapacity: true,
                    accept: true,
                    createdAt: true, updatedAt: true, doneAt: true,
                }
            })
        }
        res.status(200).json({ status: "success", data: newTask })
    }
    catch (err) {
        console.log(err)
        next(new ExpressError('Cannot update task', StatusCodes.INTERNAL_SERVER_ERROR))
    }
}

const searchTask = async (req: Request<{}, {}, searchTasksInput>, res: Response, next: NextFunction) => {
    // take out data from request body
    const { name, type, state, page, pageSize, disposalName, mcpName } = req.body
    try {
        if (state === "done") {
            const doneTasks = await prisma.doneTasks.findMany({
                skip: (page - 1) * pageSize,
                take: pageSize,
                where: {
                    name: {
                        contains: name
                    },
                    type: {
                        contains: type
                    },
                    state: {
                        contains: state
                    },
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
                            "id": true,
                            "numberPlate": true,
                            "maxWorkerSlot": true,
                            "capacity": true,
                            "fuel": true,
                            "state": true,
                            "type": true,
                            "currentMovingPointIndex": true,
                            "currentDisposalFactoryId": true,
                            "createdAt": true,
                            "updatedAt": true,
                            "workers": {
                                "select": {
                                    "id": true,
                                    "name": true,
                                    "age": true,
                                    role: true,
                                    "state": true,
                                    "image": true
                                }
                            }
                        }
                    },
                    routes: true,
                    disposalFactories: true,
                    mcp: true,
                    mcpPreviousCapacity: true,
                    mcpResultCapacity: true,
                    accept: true,
                    createdAt: true, updatedAt: true, doneAt: true,
                }
            })

            res.status(200).json({ status: "success", data: doneTasks })
        }
        else {
            const tasks = await prisma.task.findMany({
                skip: (page - 1) * pageSize,
                take: pageSize,
                where: {
                    name: {
                        contains: name
                    },
                    type: {
                        contains: type
                    },
                    state: {
                        contains: state
                    },
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
                            "id": true,
                            "numberPlate": true,
                            "maxWorkerSlot": true,
                            "capacity": true,
                            "fuel": true,
                            "state": true,
                            "type": true,
                            "currentMovingPointIndex": true,
                            "currentDisposalFactoryId": true,
                            "createdAt": true,
                            "updatedAt": true,
                            "workers": {
                                "select": {
                                    "id": true,
                                    "name": true,
                                    "age": true,
                                    role: true,
                                    "state": true,
                                    "image": true
                                }
                            }
                        }
                    },
                    routes: true,
                    disposalFactories: true,
                    mcp: true,
                    mcpPreviousCapacity: true,
                    mcpResultCapacity: true,
                    accept: true,
                    createdAt: true, updatedAt: true, doneAt: true,
                }
            })
            res.status(200).json({ status: "success", data: tasks })
        }
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
                    set: []
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
    const { id } = req.params
    const { answer } = req.body
    try {
        // find task
        let task = await prisma.task.findUnique({
            where: {
                id
            },
            select: {
                id: true,
                name: true,
                type: true,
                state: true,
                accept: true,
                routes: true,
                vehicleId: true,
                mcpId: true,
                vehicle: {
                    select: {
                        "id": true,
                        "numberPlate": true,
                        "maxWorkerSlot": true,
                        "capacity": true,
                        "fuel": true,
                        "state": true,
                        "type": true,
                        "currentMovingPointIndex": true,
                        "currentDisposalFactoryId": true,
                        "createdAt": true,
                        "updatedAt": true,
                        "workers": {
                            "select": {
                                "id": true,
                                "name": true,
                                "age": true,
                                role: true,
                                "state": true,
                                "image": true
                            }
                        }
                    }
                },
                mcp: true,
                disposalFactories: true,
                mcpPreviousCapacity: true,
                mcpResultCapacity: true,
                createdAt: true, updatedAt: true, doneAt: true,

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
        if (answer === "refuse") {
            await prisma.task.update({
                where: {
                    id
                },
                data: {
                    state: "in progress",
                    mcpResultCapacity: null,
                }
            })
            res.status(200).json({ status: "success", data: "refuse" })
        }
        else if (answer === "accept") {
            // update task to null and fuel and capacity and currentDisposal equal new second disposal of task for vehicle
            let mcp
            if (task!.type === "janitor") {
                await prisma.vehicle.update({
                    where: {
                        id: task!.vehicle!.id
                    },
                    data: {
                        currentDisposalFactory: {
                            connect: {
                                id: task!.disposalFactories.length === 1 ? task!.disposalFactories[0].id : task!.disposalFactories[1].id
                            }
                        },
                        fuel: {
                            decrement: task!.vehicle!.fuel === 0 ? 0 : 10,
                        },
                        capacity: {
                            increment: task!.vehicle!.capacity === 100 ? 0 : 10,
                        },
                        state: "nothing",
                        currentMovingPointIndex: 0
                    },
                })

                // update capacity for mcp
                mcp = await prisma.mCP.update({
                    where: {
                        id: task!.mcp!.id
                    },
                    data: {
                        capacity: {
                            decrement: task!.mcp!.capacity === 0 ? 0 : 10,
                        }
                    }
                })
            }
            else {
                await prisma.vehicle.update({
                    where: {
                        id: task!.vehicle!.id
                    },
                    data: {
                        currentDisposalFactory: {
                            connect: {
                                id: task!.disposalFactories.length === 1 ? task!.disposalFactories[0].id : task!.disposalFactories[1].id
                            }
                        },
                        fuel: {
                            decrement: task!.vehicle!.fuel === 0 ? 0 : 10,
                        },
                        state: "nothing",
                        currentMovingPointIndex: 0
                    },
                })
                
                // update capacity for mcp
                mcp = await prisma.mCP.update({
                    where: {
                        id: task!.mcp!.id
                    },
                    data: {
                        capacity: {
                            increment: task!.mcp!.capacity === 100 ? 100 : 10,
                        }
                    }
                })
            }
            // update for those workers who are in this task
            await prisma.user.updateMany({
                where: {
                    id: {
                        in: task!.vehicle!.workers!.map(worker => worker.id)
                    }
                },
                data: {
                    state: "nothing",
                }
            })

            // move task to doneTask
            await prisma.doneTasks.create({
                data: {
                    id: task!.id,
                    name: task!.name,
                    type: task!.type,
                    state: "done",
                    accept: true,
                    routes: task!.routes,
                    createdAt: task!.createdAt,
                    updatedAt: task!.updatedAt,
                    doneAt: task!.doneAt,
                    vehicle: {
                        connect: {
                            id: task!.vehicle!.id
                        }
                    },
                    mcp: {
                        connect: {
                            id: task!.mcp!.id
                        }
                    },
                    disposalFactories: {
                        connect: task!.disposalFactories.map(disposalFactory => {
                            return {
                                id: disposalFactory.id
                            }
                        })
                    },
                    mcpPreviousCapacity: task!.mcpPreviousCapacity,
                    mcpResultCapacity: mcp.capacity,
                }
            })
            // delete task
            await prisma.task.delete({
                where: {
                    id
                }
            })
            res.status(200).json({ status: "success", data: { message: "accept successfully" } })

        }
        else {
            next(new ExpressError("Answer is not valid", StatusCodes.BAD_REQUEST))
        }


    }
    catch (err) {
        next(new ExpressError("Cannot back officer review task", StatusCodes.INTERNAL_SERVER_ERROR))
    }

}

const getTaskById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params
        const task = await prisma.task.findUnique({
            where: {
                id
            },
            select: {
                id: true,
                name: true,
                type: true,
                state: true,
                accept: true,
                routes: true,
                vehicleId: true,
                mcpId: true,
                vehicle: {
                    select: {
                        "id": true,
                        "numberPlate": true,
                        "maxWorkerSlot": true,
                        "capacity": true,
                        "fuel": true,
                        "state": true,
                        "type": true,
                        "currentMovingPointIndex": true,
                        "currentDisposalFactoryId": true,
                        "createdAt": true,
                        "updatedAt": true,
                        "workers": {
                            "select": {
                                "id": true,
                                "name": true,
                                "age": true,
                                role: true,
                                "state": true,
                                "image": true
                            }
                        }
                    }
                },
                mcp: true,
                disposalFactories: true,
                mcpPreviousCapacity: true,
                mcpResultCapacity: true,
                createdAt: true, updatedAt: true, doneAt: true,
            }
        })
        if (!task) {
            next(new ExpressError("Cannot find task", StatusCodes.NOT_FOUND))
        }
        res.status(200).json({ status: "success", data: task })
    }
    catch (err) {
        next(new ExpressError("Cannot get task by id", StatusCodes.INTERNAL_SERVER_ERROR))
    }
}

const deleteDoneTasksHandle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await prisma.doneTasks.deleteMany()
        res.status(200).json({ status: "success", data: "delete done task successfully" })
    }
    catch (err) {
        next(new ExpressError("Cannot delete done task", StatusCodes.INTERNAL_SERVER_ERROR))
    }
}

export {
    createTaskHandle,
    updateNeedReviewTaskHandle,
    searchTask,
    deleteTaskHandle,
    backOfficerReviewTaskHandle,
    getTaskById,
    deleteDoneTasksHandle
}