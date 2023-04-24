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
exports.deleteDoneTasksHandle = exports.getTaskById = exports.backOfficerReviewTaskHandle = exports.deleteTaskHandle = exports.searchTask = exports.updateNeedReviewTaskHandle = exports.createTaskHandle = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const expressError_1 = __importDefault(require("../utils/expressError"));
const http_status_codes_1 = require("http-status-codes");
const createTaskHandle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // take out data from request body
        let { name, type, vehicleId, pathDisposalFactoriesIds, mcpIds, routes, createdTime } = req.body;
        const vehicle = yield prisma_1.default.vehicle.findUnique({
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
        });
        if (!vehicle) {
            next(new expressError_1.default("Vehicle not found", http_status_codes_1.StatusCodes.BAD_REQUEST));
        }
        // check is there any workers
        if ((vehicle === null || vehicle === void 0 ? void 0 : vehicle.workers) && (vehicle === null || vehicle === void 0 ? void 0 : vehicle.workers.length) <= 0) {
            next(new expressError_1.default("Vehicle has no workers", http_status_codes_1.StatusCodes.BAD_REQUEST));
        }
        if (vehicle.currentDisposalFactoryId !== pathDisposalFactoriesIds[0].id) {
            next(new expressError_1.default("Vehicle is not at the first disposal factory", http_status_codes_1.StatusCodes.BAD_REQUEST));
        }
        // find mcps
        const mcps = yield prisma_1.default.mCP.findMany({
            where: {
                id: {
                    in: mcpIds.map(mcp => mcp.id)
                }
            },
        });
        // update state of vehicle and workers
        const newVehicle = yield prisma_1.default.vehicle.update({
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
        });
        // create task
        const newTask = yield prisma_1.default.task.create({
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
                mcps: {
                    connect: mcpIds
                },
                createdAt: createdTime,
                mcpPreviousCapacitys: mcps.map((item) => item.capacity),
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
                mcps: true,
                mcpPreviousCapacitys: true,
                mcpResultCapacitys: true,
                accept: true,
                createdAt: true, updatedAt: true, doneAt: true,
            }
        });
        res.status(201).json({ status: "success", data: newTask });
    }
    catch (err) {
        console.log(err);
        next(new expressError_1.default('Cannot create task', http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR));
    }
});
exports.createTaskHandle = createTaskHandle;
const updateNeedReviewTaskHandle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // take out data from request body
    try {
        const { id } = req.params;
        // find task first
        const task = yield prisma_1.default.task.findUnique({
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
                mcpPreviousCapacitys: true,
            }
        });
        // check if worker is in that task
        if ((task === null || task === void 0 ? void 0 : task.vehicle) && !task.vehicle.workers.some(worker => worker.id === res.locals.user.id)) {
            next(new expressError_1.default("You are not in this task", http_status_codes_1.StatusCodes.FORBIDDEN));
        }
        // check if task is in need review state
        if (task.state === "need review") {
            next(new expressError_1.default("Task is already in need review state", http_status_codes_1.StatusCodes.BAD_REQUEST));
        }
        let newTask;
        if (task.type === "collector") {
            newTask = yield prisma_1.default.task.update({
                where: {
                    id: id
                },
                data: {
                    state: "need review",
                    mcpResultCapacitys: task.mcpPreviousCapacitys.map((item) => {
                        return item === 100 ? 100 : item + 10;
                    }),
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
                    mcps: true,
                    mcpPreviousCapacitys: true,
                    mcpResultCapacitys: true,
                    accept: true,
                    createdAt: true, updatedAt: true, doneAt: true,
                }
            });
        }
        else {
            newTask = yield prisma_1.default.task.update({
                where: {
                    id: id
                },
                data: {
                    state: "need review",
                    mcpResultCapacitys: task.mcpPreviousCapacitys.map((item) => {
                        return item === 0 ? 0 : item - 10;
                    })
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
                    mcps: true,
                    mcpPreviousCapacitys: true,
                    mcpResultCapacitys: true,
                    accept: true,
                    createdAt: true, updatedAt: true, doneAt: true,
                }
            });
        }
        res.status(200).json({ status: "success", data: newTask });
    }
    catch (err) {
        console.log(err);
        next(new expressError_1.default('Cannot update task', http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR));
    }
});
exports.updateNeedReviewTaskHandle = updateNeedReviewTaskHandle;
const searchTask = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // take out data from request body
    const { name, type, state, page, pageSize, disposalName, mcpName } = req.body;
    try {
        if (state === "done") {
            const doneTasks = yield prisma_1.default.doneTasks.findMany({
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
                                contains: disposalName
                            }
                        }
                    },
                    mcps: {
                        some: {
                            name: {
                                contains: mcpName
                            }
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
                    mcps: true,
                    mcpPreviousCapacitys: true,
                    mcpResultCapacitys: true,
                    accept: true,
                    createdAt: true, updatedAt: true, doneAt: true,
                }
            });
            res.status(200).json({ status: "success", data: doneTasks });
        }
        else {
            const tasks = yield prisma_1.default.task.findMany({
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
                                contains: disposalName
                            }
                        }
                    },
                    mcps: {
                        some: {
                            name: {
                                contains: mcpName
                            }
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
                    mcps: true,
                    mcpPreviousCapacitys: true,
                    mcpResultCapacitys: true,
                    accept: true,
                    createdAt: true, updatedAt: true, doneAt: true,
                }
            });
            res.status(200).json({ status: "success", data: tasks });
        }
    }
    catch (err) {
        next(new expressError_1.default("Cannot search task", http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR));
    }
});
exports.searchTask = searchTask;
const deleteTaskHandle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // take out data from request body
    const { id } = req.params;
    try {
        let task = yield prisma_1.default.task.findUnique({
            where: {
                id
            },
        });
        if (!task) {
            next(new expressError_1.default("Cannot find task", http_status_codes_1.StatusCodes.NOT_FOUND));
        }
        const newTask = yield prisma_1.default.task.delete({
            where: {
                id
            }
        });
        res.status(200).json({ status: "success", data: newTask });
    }
    catch (err) {
        console.log(err);
        next(new expressError_1.default("Cannot delete task", http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR));
    }
});
exports.deleteTaskHandle = deleteTaskHandle;
const backOfficerReviewTaskHandle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { answer } = req.body;
    try {
        // find task
        let task = yield prisma_1.default.task.findUnique({
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
                mcpIds: true,
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
                mcps: true,
                disposalFactories: true,
                mcpPreviousCapacitys: true,
                mcpResultCapacitys: true,
                createdAt: true, updatedAt: true, doneAt: true,
            }
        });
        if (!task) {
            next(new expressError_1.default("Cannot find task", http_status_codes_1.StatusCodes.NOT_FOUND));
        }
        if ((task === null || task === void 0 ? void 0 : task.state) !== "need review") {
            next(new expressError_1.default("Task is not in need review state", http_status_codes_1.StatusCodes.BAD_REQUEST));
        }
        if ((task === null || task === void 0 ? void 0 : task.accept) === true) {
            next(new expressError_1.default("Task is accepted", http_status_codes_1.StatusCodes.BAD_REQUEST));
        }
        // update task
        if (answer === "refuse") {
            yield prisma_1.default.task.update({
                where: {
                    id
                },
                data: {
                    state: "in progress",
                    mcpResultCapacitys: [],
                }
            });
            res.status(200).json({ status: "success", data: "refuse" });
        }
        else if (answer === "accept") {
            // update task to null and fuel and capacity and currentDisposal equal new second disposal of task for vehicle
            let mcps;
            if (task.type === "janitor") {
                yield prisma_1.default.vehicle.update({
                    where: {
                        id: task.vehicle.id
                    },
                    data: {
                        currentDisposalFactory: {
                            connect: {
                                id: task.disposalFactories.length === 1 ? task.disposalFactories[0].id : task.disposalFactories[1].id
                            }
                        },
                        fuel: {
                            decrement: task.vehicle.fuel === 0 ? 0 : 10,
                        },
                        capacity: {
                            increment: task.vehicle.capacity === 100 ? 0 : 10,
                        },
                        state: "nothing",
                        currentMovingPointIndex: 0
                    },
                });
                // update capacity for mcp
                // mcp = await prisma.mCP.update({
                //     where: {
                //         id: task!.mcp!.id
                //     },
                //     data: {
                //         capacity: {
                //             decrement: task!.mcp!.capacity === 0 ? 0 : 10,
                //         }
                //     }
                // })
                // update capacity for mcps
                yield prisma_1.default.mCP.updateMany({
                    where: {
                        id: {
                            in: task.mcps.map(mcp => mcp.id)
                        },
                        capacity: {
                            gte: 10
                        }
                    },
                    data: {
                        capacity: {
                            decrement: 10
                        }
                    }
                });
            }
            else {
                yield prisma_1.default.vehicle.update({
                    where: {
                        id: task.vehicle.id
                    },
                    data: {
                        currentDisposalFactory: {
                            connect: {
                                id: task.disposalFactories.length === 1 ? task.disposalFactories[0].id : task.disposalFactories[1].id
                            }
                        },
                        fuel: {
                            decrement: task.vehicle.fuel === 0 ? 0 : 10,
                        },
                        state: "nothing",
                        currentMovingPointIndex: 0
                    },
                });
                // update capacity for mcps
                yield prisma_1.default.mCP.updateMany({
                    where: {
                        id: {
                            in: task.mcps.map(mcp => mcp.id)
                        },
                        capacity: {
                            lte: 90
                        }
                    },
                    data: {
                        capacity: {
                            increment: 10
                        }
                    }
                });
            }
            // update for those workers who are in this task
            yield prisma_1.default.user.updateMany({
                where: {
                    id: {
                        in: task.vehicle.workers.map(worker => worker.id)
                    }
                },
                data: {
                    state: "nothing",
                }
            });
            // find again mcps
            mcps = yield prisma_1.default.mCP.findMany({
                where: {
                    id: {
                        in: task.mcps.map(mcp => mcp.id)
                    }
                }
            });
            // move task to doneTask
            yield prisma_1.default.doneTasks.create({
                data: {
                    id: task.id,
                    name: task.name,
                    type: task.type,
                    state: "done",
                    accept: true,
                    routes: task.routes,
                    createdAt: task.createdAt,
                    updatedAt: task.updatedAt,
                    vehicle: {
                        connect: {
                            id: task.vehicle.id
                        }
                    },
                    mcps: {
                        connect: mcps.map(mcp => {
                            return {
                                id: mcp.id
                            };
                        })
                    },
                    disposalFactories: {
                        connect: task.disposalFactories.map(disposalFactory => {
                            return {
                                id: disposalFactory.id
                            };
                        })
                    },
                    mcpPreviousCapacitys: task.mcpPreviousCapacitys,
                    mcpResultCapacitys: mcps.map(mcp => {
                        return mcp.capacity;
                    }),
                    doneAt: new Date()
                }
            });
            // delete task
            yield prisma_1.default.task.delete({
                where: {
                    id
                }
            });
            res.status(200).json({ status: "success", data: { message: "accept successfully" } });
        }
        else {
            next(new expressError_1.default("Answer is not valid", http_status_codes_1.StatusCodes.BAD_REQUEST));
        }
    }
    catch (err) {
        next(new expressError_1.default("Cannot back officer review task", http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR));
    }
});
exports.backOfficerReviewTaskHandle = backOfficerReviewTaskHandle;
const getTaskById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const task = yield prisma_1.default.task.findUnique({
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
                mcpIds: true,
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
                mcps: true,
                disposalFactories: true,
                mcpPreviousCapacitys: true,
                mcpResultCapacitys: true,
                createdAt: true, updatedAt: true, doneAt: true,
            }
        });
        if (!task) {
            next(new expressError_1.default("Cannot find task", http_status_codes_1.StatusCodes.NOT_FOUND));
        }
        res.status(200).json({ status: "success", data: task });
    }
    catch (err) {
        next(new expressError_1.default("Cannot get task by id", http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR));
    }
});
exports.getTaskById = getTaskById;
const deleteDoneTasksHandle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma_1.default.doneTasks.deleteMany();
        res.status(200).json({ status: "success", data: "delete done task successfully" });
    }
    catch (err) {
        next(new expressError_1.default("Cannot delete done task", http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR));
    }
});
exports.deleteDoneTasksHandle = deleteDoneTasksHandle;
