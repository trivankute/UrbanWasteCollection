import { io } from 'socket.io-client';
import serverUrl from '../redux/urls/urls';

const socket = io(serverUrl);

const callVehiclesAfterUpdateAddressEvent = "callVehiclesAfterUpdateAddressEvent"
function callVehiclesAfterUpdateAddressHandle (aFunction: any) {
    try {
        socket.on(callVehiclesAfterUpdateAddressEvent, (res: any) => {
            if(socket.connected)
            {
                if(res.status==="success")
                    aFunction()
                else {
                    socket.off(callVehiclesAfterUpdateAddressEvent)
                }
            }
            else {
                socket.off(callVehiclesAfterUpdateAddressEvent)
            }
        })
    }
    catch (e) {
        console.log(e)
        socket.off(callVehiclesAfterUpdateAddressEvent)
    }
}

export default socket

export {
    callVehiclesAfterUpdateAddressHandle,
    callVehiclesAfterUpdateAddressEvent
}