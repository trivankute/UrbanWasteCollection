import { memo } from "react";
import xerac from '../../../assets/vehicles/xerac.jpg'
import clsx from "clsx";

function WorkerItem({type}:{type:"nothing"|"workers"}) {
    return ( <>
        <div className="cursor-pointer hover:bg-gray-200 w-full h-fit p-2 rounded-xl bg-[#F5F5F5] flex justify-around items-center">
            {
                type==="workers" ?
                <>
                    <img src={xerac} className="w-12 h-12 rounded-full" />
                    <span className="text-sm font-normal capitalize">John</span>
                    <span className="text-sm font-normal capitalize">Vehicle: 1</span>
                </>
                :
                <>
                    <span className="font-semibold capitalize text-sm">None</span>
                </>
            }
            <div className={clsx("ml-2 w-20 h-fit rounded-xl text-white text-sm font-semibold capitailize flex justify-center items-center",{
                "bg-gray-400 p-2":type==="nothing",
                "bg-green-400":type==="workers"
            })}>{
                type==="nothing" ? "None" : "Worker"
            }</div>
        </div>
    </> );
}

export default memo(WorkerItem);