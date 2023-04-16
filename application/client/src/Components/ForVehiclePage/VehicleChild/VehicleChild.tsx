import { memo } from "react";
import xerac from '../../../assets/vehicles/xerac.jpg'
import ListFilter from "../../ListFilter/ListFilter";
import { useDispatch } from "react-redux";
import VehicleModalSlice from "../../../redux/slices/Modals/VehicleModalSlice";
import { useLocation } from "react-router-dom";

function VehicleChild() {
    const location = useLocation()
    const dispatch = useDispatch<any>()
    return ( <>
        <div onClick={()=>{
            if(location.pathname.includes("/vehicles"))
            dispatch(VehicleModalSlice.actions.handleOpen({}))
        }} className="w-full h-fit flex items-center p-2 rounded-xl shadow-lg bg-white gap-x-4 hover:bg-gray-50 cursor-pointer justify-around">
            <img src={xerac} alt="" className="w-16 h-16 rounded-full shadow-lg" />
            <div className="flex flex-col gap-y-2 items-center">
                <span className="text-sm font-semibold flex justify-start">Vehicle number 1</span>
                <span className="text-sm font-normal flex justify-start">Capacity: 50%</span>
                <span className="text-sm font-normal flex justify-start">License: 113114115</span>
                <span className="text-sm font-normal flex justify-start">Fule: 50%</span>
            </div>
            <div className="flex flex-col gap-y-2 items-center">
                <span className="text-sm font-semibold flex justify-start">Type: Janitors</span>
                <ListFilter ListArrayText={["4 workers", "van", "son", "phat", "tham"]}/>
            </div>
            <div className="flex flex-col gap-y-2 items-center">
                <span className="text-sm font-semibold flex justify-start">TaskID: 1</span>
            </div>
            <button className="w-40 h-fit p-2 text-sm font-semibold flex justify-center items-center rounded-xl text-white bg-green-400">
                Nothing
            </button>
        </div>
    </> );
}

export default memo(VehicleChild);