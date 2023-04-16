import { memo } from "react";
import xerac from '../../../assets/vehicles/xerac.jpg'

function VehicleItem() {
    return ( <>
        <div className="w-full h-fit p-2 space-x-4 rounded-xl bg-[#F5F5F5] flex justify-around items-center">
            <img src={xerac} className="w-12 h-12 sm:w-16 sm:h-16 rounded-full shadow-md" />
            <span className="font-semibold capitalize text-ant md:text-sm">Vehicle number 1</span>
            <span className="text-ant md:text-sm font-semibold">Capacity: <span className="text-ant md:text-sm font-normal">50%</span></span>
            <span className="text-ant md:text-sm font-semibold">NumberPlate: <span className="text-ant md:text-sm font-normal">113114115</span></span>
            <span className="text-ant md:text-sm font-semibold">Fule: <span className="text-ant md:text-sm font-normal">50%</span></span>
        </div>
    </> );
}

export default memo(VehicleItem);