import { memo, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { pageMotionTime } from "../../configs";
import PageHeaderSearchAdd from "../../Components/PageHeaderSearchAdd/PageHeaderSearchAdd";
import ListFilter from "../../Components/ListFilter/ListFilter";
import VehicleChild from "../../Components/ForVehiclePage/VehicleChild/VehicleChild";
import { useDispatch, useSelector } from "react-redux";
import { handleSearchVehicle } from "../../redux/slices/VehiclesSlice";
import { VehiclesStore } from "../../redux/selectors";
import Spinner from "../../Components/Spinner/Spinner";
import Pagination from "../../Components/Pagination/Pagination";

function VehiclesPage() {
    const [role, setRole] = useState("")
    const [state, setState] = useState("")
    const [disposalName, setDisposalName] = useState("")
    const [numberPlate, setNumberPlate] = useState("")
    const dispatch = useDispatch<any>()
    const vehicles = useSelector(VehiclesStore).vehicles
    const vehiclesTotal = useSelector(VehiclesStore).total
    const vehiclesLoading = useSelector(VehiclesStore).loading
    const [currPage, setCurrPage] = useState(1)
    const pageSize = 8
    const handleSearch = () => {
        dispatch(handleSearchVehicle(
            {
                "page":currPage,
                "pageSize":pageSize,
                "numberPlate":numberPlate,
                "type":role,
                "state":state,
                "disposalName":disposalName
            }
        ))
    }
    useEffect(()=>{
        handleSearch()
    },[currPage])
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
            <PageHeaderSearchAdd state={numberPlate} setCurrPage={setCurrPage} setState={setNumberPlate} handleSearch={handleSearch} type="vehicles" />
            <div className="w-full flex py-2 gap-x-4 mb-4">
                <ListFilter setCurrPage={setCurrPage} setState={setRole} ListArrayText={["type worker", "janitor", "collector"]}/>
                <ListFilter setCurrPage={setCurrPage} setState={setState} ListArrayText={["type state","nothing", "in progress"]}/>
                <ListFilter setCurrPage={setCurrPage} setState={setDisposalName} ListArrayText={["disposal?", "cao xuan duc", "disposal 2"]}/>
            </div>
            <div className="space-y-4 max-h-screen overflow-y-auto">
                {
                    vehiclesLoading ?
                    <div className="w-full h-[300px] flex justify-center items-center">
                        <Spinner />
                    </div>
                    :
                    vehicles && vehicles.length>0? 
                    <>
                    <div className="w-full h-fit font-semibold text-ant sm:text-base">Result: {vehicles.length}</div>
                    {vehicles.map((item:any, index:number) => {
                        return <VehicleChild data={item} key={index} />
                    })}
                    </>
                    :
                    <>
                    None
                    </>
                }
            </div>
            {
                <div className="w-full h-fit mt-2 flex justify-end">
                    <Pagination currPage={currPage} setCurrPage={setCurrPage} totalPage={Math.ceil(vehiclesTotal/pageSize)}/>
                </div>
            }
        </motion.div>
    </> );
}

export default memo(VehiclesPage);