import { NextFunction, Request, Response } from "express"
import ExpressError from "../utils/expressError"
import { StatusCodes } from "http-status-codes"
import prisma from "../utils/prisma"
import { RefuelVehicleInputParamHandle, SearchVehicleInputSchema, VehicleInputSchema } from "../schemas/schema.vehicle"
const createVehicleHandle = async (req: Request<{},{},VehicleInputSchema>, res: Response, next: NextFunction) => {
    try {
        let { numberPlate, disposalName } = req.body
        const newVehicle = await prisma.vehicle.create({
            data: {
                numberPlate:numberPlate,
                currentDisposalFactory: {
                    connect: {
                        name: disposalName
                    }
                }
            },
            select: {
                id: true,
                numberPlate: true,
                currentDisposalFactoryId: true,
            }
        }).catch((err) => {
            // res
            return res.json({ status: "fail", message: "Vehicle already exists" })
        })
        return res.status(201).json({ status: "success", data: newVehicle })
    }
    catch (err) {
        // create fail
        next(new ExpressError('Cannot create', StatusCodes.INTERNAL_SERVER_ERROR))
    }
}

const getAllVehicleHandle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const allVehicles = await prisma.vehicle.findMany({
            include: {
                currentDisposalFactory: {
                    select: {
                        id: true,
                        name: true,
                        addressPoint: true,
                    }
                },
                workers: {
                    select: {
                        id: true,
                        name: true,
                        vehicleId:true,
                        vehicle:true,
                        state: true,
                        role:true,
                        image:true,
                    }
                },
                task : true
            }
        })
        res.json({ status: "success", data: allVehicles })
    }
    catch (err) {
        // get all fail
        next(new ExpressError('Cannot get all', StatusCodes.INTERNAL_SERVER_ERROR))
    }
}

const getVehicleHandle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.query
        const vehicle = await prisma.vehicle.findUnique({
            where: {
                id: id as string
            },
            include: {
                currentDisposalFactory: {
                    select: {
                        id: true,
                        name: true,
                        addressPoint: true,
                    }
                },
                workers: {
                    select: {
                        id: true,
                        name: true,
                        vehicleId:true,
                        vehicle:true,
                        state: true,
                        role:true,
                        image:true
                    }
                },
                task: true
            }
        })
        if (!vehicle) {
            return res.json({ status: "fail", message: "Vehicle not found" })
        }
        res.json({ status: "success", data: vehicle })
    }
    catch (err) {
        // get fail
        next(new ExpressError('Cannot get', StatusCodes.INTERNAL_SERVER_ERROR))
    }
}

const deleteAllVehiclesHandle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await prisma.vehicle.deleteMany()
        res.json({ status: "success", message: "Delete all vehicles successfully" })
    }
    catch (err) {
        // delete all fail
        next(new ExpressError('Cannot delete all', StatusCodes.INTERNAL_SERVER_ERROR))
    }
}

const updateWorkerToVehicleHandle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { vehicleId, workerIds, typeVehicle } = req.body
        // find that vehicle
        let vehicle = await prisma.vehicle.findUnique({
            where: {
                id: vehicleId
            }
        })
        if (!vehicle) {
            return res.json({ status: "fail", message: "Vehicle not found" })
        }
        
        if(workerIds.length> vehicle.maxWorkerSlot)
        {
            return res.json({ status: "fail", message: "Max slot of this vehicle is "+vehicle.maxWorkerSlot })
        }

        // remove all worker from vehicle
        vehicle = await prisma.vehicle.update({
            where: {
                id: vehicleId
            },
            data: {
                workers: {
                    set: []
                }
            }
        })

        const newVehicle = await prisma.vehicle.update({
            where: {
                id: vehicleId
            },
            data: {
                workers: {
                    connect: workerIds
                },
                type: typeVehicle
            },
            include: {
                currentDisposalFactory: {
                    select: {
                        id: true,
                        name: true,
                        addressPoint: true,
                    }
                },
                workers: {
                    select: {
                        id: true,
                        name: true,
                        vehicleId:true,
                        vehicle:true,
                        state: true,
                        role:true,
                        image:true
                    }
                }
            }
        }).catch((err) => {
            // res
            res.json({ status: "fail", message: err.message })
        })
        res.json({ status: "success", data: newVehicle })
    }
    catch (err) {
        // assign worker to vehicle fail
        next(new ExpressError('Cannot assign worker to vehicle', StatusCodes.INTERNAL_SERVER_ERROR))
    }
}

const refuelVehicleHandle = async (req: Request<RefuelVehicleInputParamHandle,{},{}>, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params
        // find that vehicle
        let vehicle = await prisma.vehicle.findUnique({
            where: {
                id: id
            }
        })
        if (!vehicle) {
            return res.json({ status: "fail", message: "Vehicle not found" })
        }
        // check if vehicle is full
        if (vehicle.fuel == 100 && vehicle.capacity === 0) {
            return res.json({ status: "fail", message: "Vehicle is full and capacity is nothing to remove" })
        }
        
        // check if state is in progress
        if (vehicle.state === "in progress") {
            return res.json({ status: "fail", message: "Vehicle is in progress" })
        }
        // update vehicle
        vehicle = await prisma.vehicle.update({
            where: {
                id: id
            },
            data: {
                fuel: 100,
                capacity: 0
            }
        })
        res.json({ status: "success", data: vehicle })
    }
    catch (err) {
        // refuel vehicle fail
        next(new ExpressError('Cannot refuel vehicle', StatusCodes.INTERNAL_SERVER_ERROR))
    }
}

const searchVehicleHandle = async (req: Request<{},{},SearchVehicleInputSchema>, res: Response, next: NextFunction) => {
    try {
        const { type, state, page, pageSize, disposalName, numberPlate } = req.body
        const skip = (page - 1) * pageSize
        const take = pageSize
        const where = {
            numberPlate: {
                contains: numberPlate
            },
            type: {
                contains: type
            },
            state: {
                contains: state
            },
            currentDisposalFactory: {
                name: {
                    contains: disposalName
                }
            }
        }
        const allVehicles = await prisma.vehicle.findMany({
            where: where,
            skip: skip,
            take: take,
            include: {
                currentDisposalFactory: true,
                workers: {
                    select: {
                        id: true,
                        name: true,
                        vehicleId:true,
                        vehicle:true,
                        state: true,
                        role:true,
                        image:true
                    }
                },
                task: true
            }
        })
        res.json({ status: "success", data: allVehicles })
    }
    catch (err) {
        // search vehicle fail
        console.log(err)
        next(new ExpressError('Cannot find vehicle', StatusCodes.INTERNAL_SERVER_ERROR))
    }
}



export {
    createVehicleHandle,
    getAllVehicleHandle,
    getVehicleHandle,
    deleteAllVehiclesHandle,
    updateWorkerToVehicleHandle,
    refuelVehicleHandle,
    searchVehicleHandle
}