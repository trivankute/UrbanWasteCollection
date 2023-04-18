import { memo } from "react";
import clsx from "clsx";

function WorkerItem({data, type, handleSortToArrayWorkers}:{type:"nothing"|"janitor"|"collector", data:any, handleSortToArrayWorkers?:any}) {
    return ( <>
        <div onClick={()=>{
            if(handleSortToArrayWorkers) handleSortToArrayWorkers(data)
        }} className="cursor-pointer hover:bg-gray-200 w-full h-fit p-2 rounded-xl bg-[#F5F5F5] flex justify-around items-center">
            {
                (type==="janitor"||type==="collector") ?
                <>
                    <img src={data.image} className="w-12 h-12 rounded-full" />
                    <span className="text-sm font-normal capitalize">{data.name}</span>
                    <span className="text-sm font-normal capitalize">Vehicle: {data.vehicleId?(data.vehicleId.substring(0,4)+"..."):"None"}</span>
                </>
                :
                <>
                    <span className="font-semibold capitalize text-sm">None</span>
                </>
            }
            <div className={clsx("ml-2 w-20 h-fit rounded-xl text-white text-sm font-semibold capitailize flex justify-center items-center",{
                "bg-gray-400 p-2":type==="nothing",
                "bg-green-400":(type==="janitor"||type==="collector")
            })}>{
                type==="nothing" ? "None" : 
                type==="janitor" ? "Janitor" :
                type==="collector" ? "Collector" : ""
            }</div>
        </div>
    </> );
}

export default memo(WorkerItem);