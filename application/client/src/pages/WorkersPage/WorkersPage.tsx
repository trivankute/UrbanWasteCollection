import { memo, useState, useEffect } from "react";
import WorkerChild from "../../Components/ForWorkerPage/WorkerChild/WorkerChild";
import PageHeaderSearchAdd from "../../Components/PageHeaderSearchAdd/PageHeaderSearchAdd";
import { pageMotionTime } from "../../configs";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import ListFilter from "../../Components/ListFilter/ListFilter";
import { searchWorkers } from "../../redux/slices/WorkersSlice";
import { WorkersStore } from "../../redux/selectors";
import Spinner from "../../Components/Spinner/Spinner";
import Pagination from "../../Components/Pagination/Pagination";

function WorkersPage() {
    const dispatch = useDispatch<any>();
    const [role, setRole] = useState("")
    const [state, setState] = useState("")
    const [name, setName] = useState("")
    const workers = useSelector(WorkersStore)
    const [currPage, setCurrPage] = useState(1)
    const pageSize = 8
    useEffect(() => {
        handleSearch()
    }, [currPage])
    function handleSearch() {
        dispatch(searchWorkers(
            {
                "name": name,
                "role": role,
                "disposalName": "",
                "state": state,
                "page": currPage,
                "pageSize": pageSize
            }
        ))
    }
    return (<>
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
            className="h-full space-y-4"
        >
            <PageHeaderSearchAdd setState={setName} state={name} handleSearch={handleSearch} type="workers" />
            <div className="w-full h-fit flex items-center space-x-4">
                <ListFilter setState={setRole} ListArrayText={["Select role", "collector", "janitor"]} />
                <ListFilter setState={setRole} ListArrayText={["Select state", "nothing", "in progress"]} />
            </div>
            {
                workers.loading ?
                    <div className="w-full h-[300px] flex justify-center items-center">
                        <Spinner />
                    </div>
                    :
                    workers.data && workers.data.length>0? 
                    <>
                    <span className="w-full h-fit font-semibold text-base pt-2">Result: {workers.data.length}</span>
                    {workers.data.map((worker: any) => {
                        return <WorkerChild image={worker.image} workerData={worker} name={worker.name} taskName={(worker.vehicle&& worker.vehicle.task) ? worker.vehicle.task.name.substring(0,10)+"..." : "None"}
                            vehicleNumberPlate={worker.vehicle ? worker.vehicle.numberPlate : "None"} role={worker.role} />
                    })}
                    </>
                    :
                    <div className="mt-2">
                    None</div>
            }
            {
                workers.total &&
                <div className="w-full h-fit mt-auto flex justify-end">
                    <Pagination currPage={currPage} setCurrPage={setCurrPage} totalPage={Math.ceil(workers.total/pageSize)}/>
                </div>
            }
        </motion.div>
    </>);
}

export default memo(WorkersPage);