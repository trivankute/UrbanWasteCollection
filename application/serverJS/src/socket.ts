import { Server } from "socket.io";
import prisma from "./utils/prisma";

async function showAllVehiclesPoints(socket:any) {
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
    const vehiclePointsPromises = vehicles.map(async (vehicle:any)=>{
        const routes = vehicle.taskId[0].routes
        const route1 = JSON.parse(routes[0]).geometry.coordinates
        const route2 = JSON.parse(routes[1]).geometry.coordinates
        let pointIndex = vehicle.currentMovingPointIndex
        let addressPoint 
        if(route1.length>pointIndex){
            addressPoint = route1[pointIndex]
        }else{
            addressPoint = route2[pointIndex-route1.length]
        }

        pointIndex++;
        if(pointIndex==route1.length+route2.length+1){
            await prisma.vehicle.update({
                where: {
                    id: vehicle.id
                },
                data: {
                    state: "nothing",
                    currentMovingPointIndex: pointIndex
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


        return {
            id: vehicle.id,
            numberPlate: vehicle.numberPlate,
            workersQuantities: vehicle.workers.length,
            type: vehicle.type,
            capacity: vehicle.capacity,
            state: vehicle.state,
            currentMovingPointIndex: vehicle.currentMovingPointIndex,
            addressPoint: addressPoint
        }
    })

    const vehiclePoints = await Promise.all(vehiclePointsPromises)

    socket.emit("showAllVehiclesPoints", {
        status:"success",
        data: vehiclePoints
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
    // const test = setInterval(()=>{
    //     showAllVehiclesPoints(socket)
    // },5000)
    // socket.on("disconnect", () => {
    //   console.log("user disconnected");
    //     clearInterval(test)
    // });
  })
  return io;
}