import { memo, useState } from "react";
import VehicleChild from "../ForVehiclePage/VehicleChild/VehicleChild";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";


function VehicleChildList() {
    const [open, setOpen] = useState(false);
    return (<>
        <div
            onClick={()=>{
                setOpen(!open);
            }}
         className="group shadow-lg w-full space-x-6 h-fit max-h-[135px] bg-white rounded-xl flex justify-around cursor-pointer hover:bg-gray-200 p-2 z-10">
            <div className="w-full h-fit flex flex-col space-y-4 bg-white rounded-xl">
                <VehicleChild />
                {
                    open && <>
                    <VehicleChild />
                    <VehicleChild />
                    </>
                }
            </div>
            <FontAwesomeIcon icon={faArrowDown as IconProp} className='group-hover:text-green-500 cursor-pointer hover:text-green-400 w-4 h-4 text-gray-500 m-auto' />
        </div>
    </>);
}

export default memo(VehicleChildList);