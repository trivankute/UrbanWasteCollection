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

    if(vehicles)
    {
        const vehicleUpdates = vehicles.map(async (vehicle: any) => {
            if(vehicle && vehicle.task) {
              const routes = vehicle.task.routes;
              let pointIndex = vehicle.currentMovingPointIndex;
              let currentPointLimit = 0;
              routes.forEach(async (routeJson: any, index: number) => {
                const route = JSON.parse(routeJson).geometry.coordinates;
                if (pointIndex < route.length + currentPointLimit) {
                  pointIndex++;
                  if (index === routes.length - 1 && pointIndex === route.length + currentPointLimit) {
                    return prisma.vehicle.update({
                      where: {
                        id: vehicle.id
                      },
                      data: {
                        currentMovingPointIndex: 0
                      }
                    });
                  }
                  else {
                    return prisma.vehicle.update({
                      where: {
                        id: vehicle.id
                      },
                      data: {
                        currentMovingPointIndex: pointIndex
                      }
                    });
                  }
                }
                else {
                  currentPointLimit += route.length;
                }
              });
            }
          });
          
          await Promise.all(vehicleUpdates);
    }

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
        }, 3000);
        socket.on("disconnect", () => {
            console.log("user disconnected");
        });
    })
    return io;
}