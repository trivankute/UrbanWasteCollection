import { memo } from "react";
import xerac from '../../../assets/vehicles/xerac.jpg'

function VehicleItem({data}:{data:any}) {
    return ( <>
        <div className="w-full h-fit p-2 space-x-4 rounded-xl bg-[#F5F5F5] flex justify-around items-center">
            <img src={xerac} className="w-12 h-12 sm:w-16 sm:h-16 rounded-full shadow-md" />
            <span className="font-semibold capitalize text-ant md:text-sm">Vehicle: {data.numberPlate}</span>
            <span className="text-ant md:text-sm font-semibold">Capacity: <span className="text-ant md:text-sm font-normal">{data.capacity}%</span></span>
            <span className="text-ant md:text-sm font-semibold">Fuel: <span className="text-ant md:text-sm font-normal">{data.fuel}%</span></span>
        </div>
    </> );
}

export default memo(VehicleItem);