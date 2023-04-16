import { io } from 'socket.io-client';
import serverUrl from '../redux/urls/urls';

const socket = io(serverUrl);

const graphShowAllVehiclesEvent = "showAllVehiclesPoints"
function graphShowAllVehiclesHandle (setVehiclePoint: any) {
    socket.on(graphShowAllVehiclesEvent, (res: any) => {
        setVehiclePoint({
            latitude: res.data[0].addressPoint[1],
            longitude: res.data[0].addressPoint[0],
        })
    })
}

export default socket

export {
    graphShowAllVehiclesHandle, graphShowAllVehiclesEvent
}