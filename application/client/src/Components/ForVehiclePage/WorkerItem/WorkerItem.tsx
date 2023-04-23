import { memo } from "react";
import clsx from "clsx";

function WorkerItem({adjust, data, handleSortToArrayWorkers, handleRemoveWorker}:{adjust?:boolean, data:any, handleSortToArrayWorkers?:any, handleRemoveWorker?:any}) {
    return ( <>
        <div onClick={()=>{
            if(handleSortToArrayWorkers) handleSortToArrayWorkers(data)
            if(handleRemoveWorker && data && adjust) handleRemoveWorker(data)
        }} className="cursor-pointer hover:bg-gray-200 w-full h-fit p-2 rounded-xl bg-[#F5F5F5] flex justify-around items-center">
            {
                (data.role==="janitor"||data.role==="collector") ?
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
                "bg-gray-400 p-2":data.role==="nothing",
                "bg-green-400":data.role==="collector",
                "bg-red-400":data.role==="janitor"
            })}>{
                data.role==="nothing" ? "None" : 
                data.role==="janitor" ? "Janitor" :
                data.role==="collector" ? "Collector" : ""
            }</div>
        </div>
    </> );
}

export default memo(WorkerItem);