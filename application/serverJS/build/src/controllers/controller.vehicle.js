"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchVehicleHandle = exports.refuelVehicleHandle = exports.updateWorkerToVehicleHandle = exports.deleteAllVehiclesHandle = exports.getVehicleHandle = exports.getAllVehicleHandle = exports.createVehicleHandle = void 0;
const expressError_1 = __importDefault(require("../utils/expressError"));
const http_status_codes_1 = require("http-status-codes");
const prisma_1 = __importDefault(require("../utils/prisma"));
const createVehicleHandle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { numberPlate, disposalName } = req.body;
        const newVehicle = yield prisma_1.default.vehicle.create({
            data: {
                numberPlate: numberPlate,
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
            return res.json({ status: "fail", message: "Vehicle already exists" });
        });
        return res.status(201).json({ status: "success", data: newVehicle });
    }
    catch (err) {
        // create fail
        next(new expressError_1.default('Cannot create', http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR));
    }
});
exports.createVehicleHandle = createVehicleHandle;
const getAllVehicleHandle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allVehicles = yield prisma_1.default.vehicle.findMany({
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
                        vehicleId: true,
                        state: true,
                        role: true,
                        image: true
                    }
                },
                task: true
            }
        });
        res.json({ status: "success", data: allVehicles });
    }
    catch (err) {
        // get all fail
        next(new expressError_1.default('Cannot get all', http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR));
    }
});
exports.getAllVehicleHandle = getAllVehicleHandle;
const getVehicleHandle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.query;
        const vehicle = yield prisma_1.default.vehicle.findUnique({
            where: {
                id: id
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
                        vehicleId: true,
                        state: true,
                        role: true,
                        image: true
                    }
                },
                task: true
            }
        });
        if (!vehicle) {
            return res.json({ status: "fail", message: "Vehicle not found" });
        }
        res.json({ status: "success", data: vehicle });
    }
    catch (err) {
        // get fail
        next(new expressError_1.default('Cannot get', http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR));
    }
});
exports.getVehicleHandle = getVehicleHandle;
const deleteAllVehiclesHandle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma_1.default.vehicle.deleteMany();
        res.json({ status: "success", message: "Delete all vehicles successfully" });
    }
    catch (err) {
        // delete all fail
        next(new expressError_1.default('Cannot delete all', http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR));
    }
});
exports.deleteAllVehiclesHandle = deleteAllVehiclesHandle;
const updateWorkerToVehicleHandle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { vehicleId, workerIds, typeVehicle } = req.body;
        // find that vehicle
        let vehicle = yield prisma_1.default.vehicle.findUnique({
            where: {
                id: vehicleId
            }
        });
        if (!vehicle) {
            return res.json({ status: "fail", message: "Vehicle not found" });
        }
        if (workerIds.length > vehicle.maxWorkerSlot) {
            return res.json({ status: "fail", message: "Max slot of this vehicle is " + vehicle.maxWorkerSlot });
        }
        // remove all worker from vehicle
        vehicle = yield prisma_1.default.vehicle.update({
            where: {
                id: vehicleId
            },
            data: {
                workers: {
                    set: []
                }
            }
        });
        const newVehicle = yield prisma_1.default.vehicle.update({
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
                        vehicleId: true,
                        state: true,
                        role: true,
                        image: true
                    }
                }
            }
        }).catch((err) => {
            // res
            res.json({ status: "fail", message: err.message });
        });
        res.json({ status: "success", data: newVehicle });
    }
    catch (err) {
        // assign worker to vehicle fail
        next(new expressError_1.default('Cannot assign worker to vehicle', http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR));
    }
});
exports.updateWorkerToVehicleHandle = updateWorkerToVehicleHandle;
const refuelVehicleHandle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // find that vehicle
        let vehicle = yield prisma_1.default.vehicle.findUnique({
            where: {
                id: id
            }
        });
        if (!vehicle) {
            return res.json({ status: "fail", message: "Vehicle not found" });
        }
        // check if vehicle is full
        if (vehicle.fuel == 100) {
            return res.json({ status: "fail", message: "Vehicle is full" });
        }
        // check if vehicle min capacity
        if (vehicle.capacity === 0) {
            return res.json({ status: "fail", message: "Vehicle has nothing to reset capacity" });
        }
        // check if state is in progress
        if (vehicle.state === "in progress") {
            return res.json({ status: "fail", message: "Vehicle is in progress" });
        }
        // update vehicle
        vehicle = yield prisma_1.default.vehicle.update({
            where: {
                id: id
            },
            data: {
                fuel: 100,
                capacity: 0
            }
        });
        res.json({ status: "success", data: vehicle });
    }
    catch (err) {
        // refuel vehicle fail
        next(new expressError_1.default('Cannot refuel vehicle', http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR));
    }
});
exports.refuelVehicleHandle = refuelVehicleHandle;
const searchVehicleHandle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { type, state, page, pageSize, disposalName, numberPlate } = req.body;
        const skip = (page - 1) * pageSize;
        const take = pageSize;
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
        };
        const allVehicles = yield prisma_1.default.vehicle.findMany({
            where: where,
            skip: skip,
            take: take,
            include: {
                currentDisposalFactory: true,
                workers: {
                    select: {
                        id: true,
                        name: true,
                        vehicleId: true,
                        state: true,
                        role: true,
                        image: true
                    }
                },
                task: true
            }
        });
        res.json({ status: "success", data: allVehicles });
    }
    catch (err) {
        // search vehicle fail
        console.log(err);
        next(new expressError_1.default('Cannot find vehicle', http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR));
    }
});
exports.searchVehicleHandle = searchVehicleHandle;
