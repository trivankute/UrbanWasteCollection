import { Server } from "socket.io";
import prisma from "./utils/prisma";

async function updateAllVehiclesPoints(socket: any) {
    const vehicles = await prisma.vehicle.findMany({
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
        return
    }

    const vehiclePointsPromises = vehicles.map(async (vehicle: any) => {
        const routes = vehicle.task.routes
        let pointIndex = vehicle.currentMovingPointIndex
        let currentPointLimit = 0;
        routes.map(async (routeJson: any, index: number) => {
            const route = JSON.parse(routeJson).geometry.coordinates
            if (pointIndex < route.length + currentPointLimit) {
                pointIndex++;
                if (index === routes.length - 1 && pointIndex === route.length + currentPointLimit) {
                    await prisma.vehicle.update({
                        where: {
                            id: vehicle.id
                        },
                        data: {
                            currentMovingPointIndex: 0
                        }

                    })
                }
                else {
                    await prisma.vehicle.update({
                        where: {
                            id: vehicle.id
                        },
                        data: {
                            currentMovingPointIndex: pointIndex
                        }

                    })
                }
                return
            }
            else {
                currentPointLimit += route.length
            }
        })
    })

    await Promise.all(vehiclePointsPromises)

    socket.emit("callVehiclesAfterUpdateAddressEvent", {
        status: "success"
    });
}


let intervalId: NodeJS.Timeout;
export default function configureSocket(server: any) {
    const io = new Server(server, {
        cors: {
            origin: "*",
        },
    });
    io.on("connection", (socket) => {
        console.log("a user connected");
        if (intervalId) clearInterval(intervalId); // Clear previous interval if it exists
        intervalId = setInterval(() => {
            updateAllVehiclesPoints(socket);
        }, 5000);
        socket.on("disconnect", () => {
            console.log("user disconnected");
        });
    })
    return io;
}