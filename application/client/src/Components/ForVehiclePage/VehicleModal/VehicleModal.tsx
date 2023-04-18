import { AnimatePresence, motion } from "framer-motion";
import { memo, useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ResponsiveStore, VehicleModalStore, WorkersStore } from "../../../redux/selectors";
import VehicleModalSlice from "../../../redux/slices/Modals/VehicleModalSlice";
import { pageMotionTime } from "../../../configs";
import xerac from '../../../assets/vehicles/xerac.jpg'
import SearchBar from "../../SearchBar/SearchBar";
import ListFilter from "../../ListFilter/ListFilter";
import WorkerItem from "../WorkerItem/WorkerItem";
import clsx from "clsx";
import { searchWorkers } from "../../../redux/slices/WorkersSlice";

function VehicleModal() {
    const [workerName, setWorkerName] = useState("")
    const [workerRole, setWorkerRole] = useState("")
    const [adjust, isAdjust] = useState(false)
    const vehicleModalIsShow = useSelector(VehicleModalStore).data
    const vehicle = useSelector(VehicleModalStore).vehicle
    const responsive = useSelector(ResponsiveStore).data
    const [workersTemp, setWorkersTemp] = useState(() => {
        let result: any = {
            type: vehicle.type,
            workers: [],
        }
        vehicle.workers.map((worker: any, index: number) => {
            result.workers.push(worker)
        })
        return result
    })
    const dispatch = useDispatch<any>()
    const workers = useSelector(WorkersStore).data
    const mainRef = useRef<any>()
    useEffect(() => {
        dispatch(searchWorkers(
            {
                "name": "",
                "role": "",
                "disposalName": "",
                "state": "nothing",
                "page": 1,
                "pageSize": 10
            }
        ))
    }, [])
    useEffect(()=>{
        if(mainRef)
        {
            mainRef.current.scrollIntoView({behavior: "smooth"})
        }
    },[mainRef.current])
    function handleSearch() {
        dispatch(searchWorkers(
            {
                "name": workerName,
                "role": workerRole,
                "disposalName": "",
                "state": "nothing",
                "page": 1,
                "pageSize": 10
            }
        ))
    }
    function handleSortToArrayWorkers(worker: any) {
        if (workersTemp.workers.length < 4) {
            // add one worker to workersTemp.workers
            setWorkersTemp((prev: any) => {
                let result: any = {
                    type: prev.type,
                    workers: [],
                }
                prev.workers.map((worker: any, index: number) => {
                    result.workers.push(worker)
                })
                result.workers.push(worker)
                return result
            })
        }
    }
    return (<>
        <div className="w-full h-full fixed flex justify-center z-30 items-center">
            <div onClick={() => {
                dispatch(VehicleModalSlice.actions.handleClose({}))
            }} className="w-full h-full fixed bg-gray-400 opacity-50">
            </div>
            <motion.div
                initial={{
                    opacity: 0,
                    y: "10%"
                }}
                animate={{
                    opacity: vehicleModalIsShow ? 1 : 0,
                    y: vehicleModalIsShow ? 0 : "10%"
                }}
                exit={{
                    opacity: 0,
                    y: "10%"
                }}
                transition={{
                    duration: pageMotionTime
                }}
                className="w-[100%] max-w-[360px] sm:max-w-[800px] h-fit max-h-[500px] sm:max-h-full overflow-y-auto fixed -mt-20 shadow-lg z-20"
            >
                <div className="relative rounded-lg overflow-hidden w-full max-h-full flex flex-col md:flex-row">
                    <div className="flex flex-col flex-1 bg-white z-10">
                        <div className="relative dark:bg-gray-600">
                            <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Vehicle Detail
                                </h3>
                                <button
                                    onClick={() => {
                                        dispatch(VehicleModalSlice.actions.handleClose({}))
                                    }}
                                    type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="defaultModal">
                                    <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                                    <span className="sr-only">Close modal</span>
                                </button>
                            </div>
                            <div className="p-6 space-y-6 border-b">
                                <div className="w-full h-fit p-4 pt-0 flex items-center justify-between">
                                    <div className="flex-1 h-full flex justify-center items-center">
                                        <img src={xerac} className="w-16 h-16 rounded-full shadow-md" />
                                    </div>
                                    <div className="flex-1 h-full flex flex-col justify-center items-start gap-y-0 ">
                                        <span className="font-semibold capitalize text-sm">Vehicle: {vehicle.numberPlate}</span>
                                        <span className="text-sm font-semibold">Capacity: <span className="text-sm font-normal">{vehicle.capacity}%</span></span>
                                        <span className="text-sm font-semibold">Fuel: <span className="text-sm font-normal">{vehicle.fuel}%</span></span>
                                    </div>
                                </div>
                                <div className="w-full h-fit p-4 pt-0 flex items-center justify-between">
                                    <div className="flex-1 h-full flex flex-col justify-center items-start gap-y-0 ">
                                        <span className="text-sm font-semibold capitailize">Task name: <span className="text-sm font-normal">{vehicle.task.length > 0 ? vehicle.task[0].name : "None"}</span></span>
                                        <span className="text-sm font-semibold capitailize">State: <span className="text-sm font-normal">{vehicle.state}</span></span>
                                        <div className="flex items-center mt-1 w-full capitailize">
                                            <span className="text-sm font-semibold flex justify-center items-center">Type: </span>
                                            <span className="ml-2 w-20 h-fit rounded-xl bg-green-400 text-white text-sm font-semibold flex justify-center items-center capitailize">{vehicle.type}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-full h-fit p-4 pt-2">
                            <div className="flex w-full justify-between items-center">
                                <span className="text-sm font-semibold">
                                    Number: {vehicle.workers.length}/4 Workers
                                </span>
                                <span onClick={() => {
                                    isAdjust(!adjust)
                                }} className={clsx("text-sm font-semibold capitalize cursor-pointer", {
                                    "text-green-500": adjust,
                                })}>{adjust ? "Click to accept" : "Click to adjust"}</span>
                            </div>
                            <div className="w-full p-2"></div>
                            <div className="space-y-2">
                                {
                                    workersTemp.workers.map((item: any, index: number) => {
                                        return (
                                            <WorkerItem handleSortToArrayWorkers={handleSortToArrayWorkers} data={item !== -1 ? item : ""} type={item !== -1 ? item.role : "nothing"} key={index} />
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                    <AnimatePresence mode="wait" >
                        {
                            adjust &&
                            <motion.div
                                ref={mainRef}
                                initial={responsive ? { y: "-100%", opacity: 0 } : { x: "-100%", opacity: 0 }}
                                animate={responsive ? { y: 0, opacity: 1 } : { x: 0, opacity: 1 }}
                                exit={responsive ? { y: "-100%", opacity: 0 } : { x: "-100%", opacity: 0 }}
                                className="relative flex-1 bg-white border-l dark:bg-gray-700 z-0">
                                <div className="flex items-start justify-between p-4 pb-0 rounded-t gap-x-2">
                                    <SearchBar setState={setWorkerName} state={workerName} handleSearch={handleSearch} />
                                </div>
                                <div className="flex items-start justify-between p-4 rounded-t w-full">
                                    <ListFilter setState={setWorkerRole} ListArrayText={["type worker", "janitor", "collector"]} />
                                </div>
                                <div className="p-6 space-y-2 max-h-[500px] overflow-y-auto">
                                    {
                                        workers.length > 0 ? workers.map((worker: any, index: number) => {
                                            return (
                                                <WorkerItem handleSortToArrayWorkers={handleSortToArrayWorkers} data={worker} type={worker.role} key={index} />
                                            )
                                        }) :
                                            "None"
                                    }
                                </div>
                            </motion.div>
                        }
                    </AnimatePresence>
                </div>

            </motion.div>
        </div>

    </>);
}

export default memo(VehicleModal);