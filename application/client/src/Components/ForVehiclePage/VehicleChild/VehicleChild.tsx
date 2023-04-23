import { memo } from "react";
import xerac from '../../../assets/vehicles/xerac.jpg'
import { useDispatch } from "react-redux";
import VehicleModalSlice from "../../../redux/slices/Modals/VehicleModalSlice";
import { useLocation } from "react-router-dom";
import clsx from "clsx";

function VehicleChild({data=null, setForAddTask}:{data?:any, setForAddTask?:any}) {
    const location = useLocation()
    const dispatch = useDispatch<any>()
    return ( <>
        <div onClick={()=>{
            if(location.pathname.includes("/vehicles")||location.pathname.includes("worker/overview"))
            dispatch(VehicleModalSlice.actions.handleOpen({data:data}))
            else if(setForAddTask && location.pathname.includes("/tasks/add"))
            setForAddTask(data)
        }} className="w-full h-fit flex items-center p-2 rounded-xl shadow-lg bg-white gap-x-4 hover:bg-gray-50 cursor-pointer justify-around">
            <img src={xerac} alt="" className="w-16 h-16 rounded-full shadow-lg" />
            <div className="flex flex-col gap-y-2 items-center">
                <span className="text-sm font-semibold flex justify-start">Vehicle: {data.numberPlate}</span>
                <span className="text-sm font-normal flex justify-start">Capacity: {data.capacity}%</span>
                <span className="text-sm font-normal flex justify-start">Fuel: {data.fuel}%</span>
            </div>
            <div className="flex flex-col gap-y-2 items-center">
                <span className="text-sm font-semibold flex justify-start capitalize">Type: {data.type}</span>
                <span className="text-sm font-semibold flex justify-start">{data.workers.length} Worker{`${data.workers.length>1?"s":""}`}</span>
            </div>
            <div className="flex flex-col gap-y-2 items-center">
                <span className="text-sm font-semibold flex justify-start">TaskId: {data.task?data.task.id?(data.task.id.substring(0,4)+"..."):"None":"None"}</span>
            </div>
            <div className={clsx("w-40 h-fit p-2 text-sm font-semibold flex justify-center items-center rounded-xl text-white capitalize", {
                "bg-green-400": data.state === "nothing",
                "bg-yellow-400": data.state === "in progress",
            })}>
                {data.state}
            </div>
        </div>
    </> );
}

export default memo(VehicleChild);