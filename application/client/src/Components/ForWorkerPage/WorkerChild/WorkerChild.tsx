import { memo } from "react";
import xerac from "../../../assets/vehicles/xerac.jpg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faComment } from '@fortawesome/free-solid-svg-icons'
import { useDispatch } from "react-redux";
import WorkerModalSlice from "../../../redux/slices/Modals/WorkerModalSlice";
import clsx from "clsx";
import { useLocation } from "react-router-dom";

function WorkerChild({ role, workerData, name, taskName, vehicleNumberPlate }: { role: "backofficer" | "janitor" | "collector",
workerData:any,name:string,taskName:string,vehicleNumberPlate:string },
) {
    const location = useLocation()
    const dispatch = useDispatch<any>()
    return (<>
        <div onClick={() => {
            if (location.pathname.includes("/workers"))
                dispatch(WorkerModalSlice.actions.handleOpen({workerData}))
        }} className="w-full h-fit rounded-2xl overflow-hidden items-center px-8 py-4 bg-white shadow-md grid grid-cols-3 md:grid-cols-6 cursor-pointer hover:bg-gray-50">
            <img src={xerac} alt="" className="w-10 h-10 shadow-md rounded-full" />
            <span className="font-semibold text-sm">Name: {name}</span>
            <span className="font-semibold text-sm">Vehicle: {vehicleNumberPlate}</span>
            <span className="font-semibold text-sm">Task: {taskName}</span>
            <div className="w-fit flex justify-between items-center gap-2">
                <svg aria-hidden="true" className="cursor-pointer hover:text-green-400 flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>
                <FontAwesomeIcon icon={faComment as IconProp} className='cursor-pointer hover:text-green-400 w-6 h-6 text-gray-500' />
            </div>
            <div className={clsx("w-28 h-fit p-2 font-semibold  text-white rounded-full text-center", {
                "bg-green-400": role === "backofficer",
                "bg-yellow-400": role === "janitor",
                "bg-red-400": role === "collector"
            })}>
                {role}
            </div>
        </div>
    </>);
}

export default memo(WorkerChild);