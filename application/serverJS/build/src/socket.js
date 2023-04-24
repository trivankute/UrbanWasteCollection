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
const socket_io_1 = require("socket.io");
const prisma_1 = __importDefault(require("./utils/prisma"));
function updateAllVehiclesPoints(socket) {
    return __awaiter(this, void 0, void 0, function* () {
        const vehicles = yield prisma_1.default.vehicle.findMany({
            where: {
                state: "in progress"
            },
            include: {
                workers: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                task: {
                    select: {
                        id: true,
                        name: true,
                        routes: true
                    },
                },
            },
        });
        if (vehicles.length == 0) {
            // emit error
            socket.emit("callVehiclesAfterUpdateAddressEvent", {
                status: "error",
                message: "No vehicles in progress"
            });
            return;
        }
        const vehiclePointsPromises = vehicles.map((vehicle) => __awaiter(this, void 0, void 0, function* () {
            const routes = vehicle.task.routes;
            let pointIndex = vehicle.currentMovingPointIndex;
            let currentPointLimit = 0;
            routes.map((routeJson, index) => __awaiter(this, void 0, void 0, function* () {
                const route = JSON.parse(routeJson).geometry.coordinates;
                if (pointIndex < route.length + currentPointLimit) {
                    pointIndex++;
                    if (index === routes.length - 1 && pointIndex === route.length + currentPointLimit) {
                        yield prisma_1.default.vehicle.update({
                            where: {
                                id: vehicle.id
                            },
                            data: {
                                currentMovingPointIndex: 0
                            }
                        });
                    }
                    else {
                        yield prisma_1.default.vehicle.update({
                            where: {
                                id: vehicle.id
                            },
                            data: {
                                currentMovingPointIndex: pointIndex
                            }
                        });
                    }
                    return;
                }
                else {
                    currentPointLimit += route.length;
                }
            }));
        }));
        yield Promise.all(vehiclePointsPromises);
        socket.emit("callVehiclesAfterUpdateAddressEvent", {
            status: "success"
        });
    });
}
let intervalId;
function configureSocket(server) {
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: "*",
        },
    });
    io.on("connection", (socket) => {
        console.log("a user connected");
        if (intervalId)
            clearInterval(intervalId); // Clear previous interval if it exists
        intervalId = setInterval(() => {
            updateAllVehiclesPoints(socket);
        }, 5000);
        socket.on("disconnect", () => {
            console.log("user disconnected");
        });
    });
    return io;
}
exports.default = configureSocket;
