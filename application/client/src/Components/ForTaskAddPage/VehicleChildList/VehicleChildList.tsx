import { memo, useState, useEffect } from "react";
import VehicleChild from "../../ForVehiclePage/VehicleChild/VehicleChild";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { useDispatch, useSelector } from "react-redux";
import SmallNotification from "../../../redux/slices/Modals/SmallNotificationSlice";
import { VehiclesStore } from "../../../redux/selectors";
import Spinner from "../../Spinner/Spinner";

function VehicleChildList({ vehicles, vehicle, setVehicle }: { vehicles: any, vehicle:any, setVehicle:any }) {
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch<any>()
    const vehiclesLoading = useSelector(VehiclesStore).loading
    useEffect(() => {
        const newVehicles = vehicles?vehicles.filter((item:any)=>{
            if(item.state==="nothing"&&item.workers.length>0)
                return item
        }):null
        if (!vehiclesLoading&&newVehicles && newVehicles.length > 0)
            setVehicle(newVehicles[0])
        else
            setVehicle(null)
    }, [vehiclesLoading])
    return (<>
        <div
            onClick={() => {
                let boolForUndefineds = false
                const newVehiclesForCheck = vehicles.map((item: any) => {
                    if (vehicle && item.id !== vehicle.id && item.workers.length > 0)
                        return item
                    else {
                        boolForUndefineds = true
                    }
                })
                if (boolForUndefineds || newVehiclesForCheck.length === 0)
                    dispatch(SmallNotification.actions.handleOpen({ type: "error", content: "There is not any vehicle else." }))
                else
                    setOpen(!open)
            }}
            className="group shadow-lg w-full space-x-6 h-fit max-h-[135px] bg-white rounded-xl flex justify-around cursor-pointer hover:bg-gray-200 p-2 z-10">
            <div className="w-full h-fit flex flex-col space-y-4 bg-white rounded-xl">
                {
                    vehiclesLoading ?
                    <>
                    <div className="w-full h-full flex justify-center items-center">
                        <Spinner />
                    </div>
                    </>
                    :
                    <>
                    {vehicle && <VehicleChild setForAddTask={setVehicle} data={vehicle} />}
                    {
                        vehicles && vehicle && vehicles.map((item: any, index: number) => {
                            if (open && item.id !== vehicle.id && item.workers.length > 0)
                                return <VehicleChild setForAddTask={setVehicle} data={item} key={index} />
                        })
                    }
                    </>
                }
            </div>
            <FontAwesomeIcon icon={faArrowDown as IconProp} className='group-hover:text-green-500 cursor-pointer hover:text-green-400 w-4 h-4 text-gray-500 m-auto' />
        </div>
    </>);
}

export default memo(VehicleChildList);