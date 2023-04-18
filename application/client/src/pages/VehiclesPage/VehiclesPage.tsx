import { memo, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { pageMotionTime } from "../../configs";
import PageHeaderSearchAdd from "../../Components/PageHeaderSearchAdd/PageHeaderSearchAdd";
import ListFilter from "../../Components/ListFilter/ListFilter";
import VehicleChild from "../../Components/ForVehiclePage/VehicleChild/VehicleChild";
import { useDispatch, useSelector } from "react-redux";
import { getAllVehicles, handleSearchVehicle } from "../../redux/slices/VehiclesSlice";
import { VehiclesStore } from "../../redux/selectors";
import Spinner from "../../Components/Spinner/Spinner";

function VehiclesPage() {
    const [role, setRole] = useState("")
    const [state, setState] = useState("")
    const [numberPlate, setNumberPlate] = useState("")
    const dispatch = useDispatch<any>()
    const vehilces = useSelector(VehiclesStore).vehicles
    const handleSearch = () => {
        dispatch(handleSearchVehicle(
            {
                "page":1,
                "pageSize":20,
                "numberPlate":numberPlate,
                "type":role,
                "state":state,
                "disposalName":""
            }
        ))
    }
    useEffect(()=>{
        dispatch(getAllVehicles())
    },[])
    return ( <>
        <motion.div
            initial={{
                opacity: 0,
                y: "10%"
            }}
            animate={{
                opacity: 1,
                y: 0
            }}
            exit={{
                opacity: 0,
                y: "10%"
            }}
            transition={{
                duration: pageMotionTime
            }}
            className="h-full"
        >
            <PageHeaderSearchAdd state={numberPlate} setState={setNumberPlate} handleSearch={handleSearch} type="vehicles" />
            <div className="w-full flex py-2 gap-x-4 mb-4">
                <ListFilter setState={setRole} ListArrayText={["type worker", "janitor", "collector"]}/>
                <ListFilter setState={setState} ListArrayText={["type state","nothing", "in progress"]}/>
            </div>
            <div className="space-y-4 max-h-screen overflow-y-auto">
                {
                    vehilces ? vehilces.map((item:any, index:number) => {
                        return <VehicleChild data={item} key={index} />
                    })
                    :
                    <div className="w-full h-[300px] flex justify-center items-center">
                        <Spinner />
                    </div>
                }
            </div>
        </motion.div>
    </> );
}

export default memo(VehiclesPage);