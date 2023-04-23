import { Server } from "socket.io";
import prisma from "./utils/prisma";

async function updateAllVehiclesPoints(socket:any) {
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

    if(vehicles.length==0){
        // emit error
        socket.emit("callVehiclesAfterUpdateAddressEvent", {
            status:"error",
            message:"No vehicles in progress"
        });
        return
    }

    const vehiclePointsPromises = vehicles.map(async (vehicle:any)=>{
        const routes = vehicle.task.routes
        const route1 = JSON.parse(routes[0]).geometry.coordinates
        const route2 = JSON.parse(routes[1]).geometry.coordinates
        let pointIndex = vehicle.currentMovingPointIndex
        pointIndex++;
        if(pointIndex===route1.length+route2.length+1){
            await prisma.vehicle.update({
                where: {
                    id: vehicle.id
                },
                data: {
                    currentMovingPointIndex: 0
                }

            })
        }
        else
        {
            await prisma.vehicle.update({
                where: {
                    id: vehicle.id
                },
                data: {
                    currentMovingPointIndex: pointIndex
                }

            })
        }
    })

    await Promise.all(vehiclePointsPromises)

    socket.emit("callVehiclesAfterUpdateAddressEvent", {
        status:"success"
    });
}



export default function configureSocket(server: any) {
  const io = new Server(server, {
    cors: {
        origin: "*",
    },
  });
  io.on("connection", (socket) => {
    console.log("a user connected");
    const test = setInterval(()=>{
        updateAllVehiclesPoints(socket)
    },5000)
    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  })
  return io;
}