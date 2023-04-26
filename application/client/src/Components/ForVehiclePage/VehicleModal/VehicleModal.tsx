import { AnimatePresence, motion } from "framer-motion";
import { memo, useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ResponsiveStore, UserStore, VehicleModalStore, VehiclesStore, WorkersStore } from "../../../redux/selectors";
import VehicleModalSlice from "../../../redux/slices/Modals/VehicleModalSlice";
import { pageMotionTime } from "../../../configs";
import xerac from '../../../assets/vehicles/xerac.jpg'
import SearchBar from "../../SearchBar/SearchBar";
import ListFilter from "../../ListFilter/ListFilter";
import WorkerItem from "../WorkerItem/WorkerItem";
import clsx from "clsx";
import WorkersSlice, { searchWorkers } from "../../../redux/slices/WorkersSlice";
import Spinner from "../../Spinner/Spinner";
import { assignWorkersToVehicle, getAllVehicles } from "../../../redux/slices/VehiclesSlice";
import SmallNotificationSlice from "../../../redux/slices/Modals/SmallNotificationSlice";

function VehicleModal() {
    const [workerName, setWorkerName] = useState("")
    const [workerRole, setWorkerRole] = useState("")
    const [adjust, isAdjust] = useState(false)
    const vehicleModalIsShow = useSelector(VehicleModalStore).data
    const vehicle = useSelector(VehicleModalStore).vehicle
    const vehicleLoading = useSelector(VehiclesStore).loading
    const responsive = useSelector(ResponsiveStore).data
    const user = useSelector(UserStore).data
    const [workersTemp, setWorkersTemp] = useState(() => {
        let result: any = {
            type: vehicle.type, // janitor, collector, nothing
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
                "pageSize": 10,
                forAssignVehicleModal: true,
                workersTempForAssignVehicle: workersTemp
            }
        ))
    }, [])
    useEffect(() => {
        if (mainRef.current) {
            mainRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [mainRef.current])
    function handleSearch() {
        dispatch(searchWorkers(
            {
                "name": workerName,
                "role": workerRole,
                "disposalName": "",
                "state": "nothing",
                "page": 1,
                "pageSize": 10,
                forAssignVehicleModal: true,
                workersTempForAssignVehicle: workersTemp
            }
        ))
    }
    function handleSortToArrayWorkers(worker: any) {
        if (!workersTemp.workers) return;

        if (workersTemp.workers.length === 4) {
            dispatch(SmallNotificationSlice.actions.handleOpen({ type: "error", content: "You can only assign 4 workers to a vehicle" }))
        }
        else if (workersTemp.workers.includes(worker) === true) {
            dispatch(SmallNotificationSlice.actions.handleOpen({ type: "error", content: "You can not assign the same worker twice" }))
        }
        else if (workersTemp.type !== "nothing" && workersTemp.type !== worker.role) {
            dispatch(SmallNotificationSlice.actions.handleOpen({ type: "error", content: "You can only assign one role to a vehicle" }))
        }
        else {
            // add one worker to workersTemp.workers
            setWorkersTemp((prev: any) => {
                let result: any = {
                    type: prev.type,
                    workers: [],
                }
                prev.workers.map((worker: any, index: number) => {
                    result.workers.push(worker)
                })
                // remove on workers side
                dispatch(WorkersSlice.actions.handleRemoveWorkerForTemp(worker.id))
                result.workers.push(worker)
                // update the workersTemp type
                if (result.workers.length === 1) {
                    result.type = worker.role
                }
                return result
            })
        }
    }

    function handleRemoveWorker(worker: any) {
        setWorkersTemp((prev: any) => {
            let result: any = {
                type: prev.type,
                workers: [],
            }
            prev.workers.map((workerTemp: any, index: number) => {
                if (workerTemp.id !== worker.id)
                    result.workers.push(workerTemp)
            })
            // add on workers side
            dispatch(WorkersSlice.actions.handleAddWorkerForTemp({ worker: worker }))
            // update the workersTemp type
            if (result.workers.length === 0) {
                result.type = "nothing"
            }
            return result
        })
    }

    function handleAssign() {
        let newDataWorkers
        if(workersTemp.workers.length>0)
        newDataWorkers = workersTemp.workers.map((item: any) => {
            return {
                id: item.id
            }
        })
        else
        newDataWorkers = []
        dispatch(assignWorkersToVehicle({
            vehicleId: vehicle.id,
            workerIds: newDataWorkers,
            typeVehicle: workersTemp.type
        }))
            .then((res: any) => {
                if (res.payload.status === "success") {
                    dispatch(SmallNotificationSlice.actions.handleOpen({ type: "success", content: "Assign workers successfully" }))
                    dispatch(VehicleModalSlice.actions.handleClose({}))
                    dispatch(getAllVehicles())
                    isAdjust(false)
                }
            })
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
                className="w-[100%] max-w-[360px] sm:max-w-[800px] h-fit max-h-[500px] sm:max-h-full overflow-y-auto fixed -mt-32 shadow-lg z-20"
            >
                {
                    vehicle ?
                        <>
                            <div className="relative rounded-lg overflow-hidden w-full max-h-full flex flex-col md:flex-row">
                                <div className="flex flex-col flex-1 bg-white z-10">
                                    <div className="relative dark:bg-gray-600">
                                        <div className="flex items-start justify-between p-2 sm:p-4 border-b rounded-t dark:border-gray-600">
                                            <h3 className="text-ant sm:text-xl font-semibold text-gray-900 dark:text-white">
                                                Vehicle Detail
                                            </h3>
                                            <button
                                                onClick={() => {
                                                    dispatch(VehicleModalSlice.actions.handleClose({}))
                                                }}
                                                type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-ant sm:text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="defaultModal">
                                                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                                                <span className="sr-only">Close modal</span>
                                            </button>
                                        </div>
                                        <div className="p-6 pb-0 space-y-6 border-b">
                                            <div className="w-full h-fit p-4 pt-0 flex items-center justify-between">
                                                <div className="flex-1 h-full flex justify-center items-center">
                                                    <img src={xerac} className="w-10 h-10 sm:w-16 sm:h-16 rounded-full shadow-md" />
                                                </div>
                                                <div className="flex-1 h-full flex flex-col justify-center items-start gap-y-0 ">
                                                    <span className="font-semibold capitalize text-ant sm:text-sm">Vehicle: {vehicle.numberPlate}</span>
                                                    <span className="text-ant sm:text-sm font-semibold">Capacity: <span className="text-ant sm:text-sm font-normal">{vehicle.capacity}%</span></span>
                                                    <span className="text-ant sm:text-sm font-semibold">Fuel: <span className="text-ant sm:text-sm font-normal">{vehicle.fuel}%</span></span>
                                                </div>
                                            </div>
                                            <div className="w-full h-fit p-4 pt-0 flex items-center justify-between">
                                                <div className="flex-1 h-full flex flex-col justify-center items-start gap-y-0 ">
                                                    <span className="text-ant sm:text-sm font-semibold capitalize">Task name: <span className="text-ant sm:text-sm font-normal">{vehicle.task?vehicle.task.length > 0 ? vehicle.task[0].name : "None":"None"}</span></span>
                                                    <span className="text-ant sm:text-sm font-semibold capitalize">Current disposal factory name: <span className="text-ant sm:text-sm font-normal">{vehicle.currentDisposalFactory.name}</span></span>
                                                    <span className="text-ant sm:text-sm font-semibold capitalize">State: <span className="text-ant sm:text-sm font-normal">{vehicle.state}</span></span>
                                                    <div className="flex items-center mt-1 w-full capitalize">
                                                        <span className="text-ant sm:text-sm font-semibold flex justify-center items-center">Type: </span>
                                                        <span className={clsx("ml-2 w-20 h-fit rounded-xl bg-green-400 text-white text-ant sm:text-sm font-semibold flex justify-center items-center capitalize", {
                                                            "bg-gray-400 p-2": vehicle.type === "nothing",
                                                            "bg-green-400": vehicle.type === "collector",
                                                            "bg-red-400": vehicle.type === "janitor"
                                                        })}>{vehicle.type}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-full h-fit p-4 pt-2">
                                        <div className="flex w-full justify-between items-center">
                                            <span className="text-ant sm:text-sm font-semibold">
                                                Number: {vehicle.workers.length}/4 Workers
                                            </span>
                                            {
                                                user.role==="backofficer"&&vehicle.state!=="in progress"&&
                                                <>
                                                {
                                                !vehicleLoading ?
                                                    <span onClick={() => {
                                                            if (adjust === false)
                                                                isAdjust((prev: boolean) => {
                                                                    return !prev
                                                                })
                                                            else
                                                                handleAssign()
                                                    }} className={clsx("text-ant sm:text-sm font-semibold capitalize cursor-pointer", {
                                                        "text-green-500": adjust,
                                                    })}>{adjust ? "Click to accept" : "Click to adjust"}</span>
                                                    :
                                                    <div className="w-full h-fit flex justify-center items-center">
                                                        <Spinner />
                                                    </div>
                                                }
                                                </>
                                            }
                                        </div>
                                        <div className="w-full p-2"></div>
                                        <div className="space-y-2">
                                            {
                                                workersTemp.workers.map((item: any, index: number) => {
                                                    return (
                                                        <WorkerItem adjust={adjust} handleRemoveWorker={handleRemoveWorker} data={item} key={index} />
                                                    )
                                                })
                                            }
                                            {
                                                Array.from({ length: 4 - workersTemp.workers.length }).map((item: any, index: number) => {
                                                    return (
                                                        <WorkerItem data={""} key={index} />
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
                                                            <WorkerItem adjust={adjust} handleSortToArrayWorkers={handleSortToArrayWorkers} data={worker} key={index} />
                                                        )
                                                    }) :
                                                        "None"
                                                }
                                            </div>
                                        </motion.div>
                                    }
                                </AnimatePresence>
                            </div>
                        </>
                        :
                        <div className="w-full h-[300px] flex justify-center items-center">
                            <Spinner />
                        </div>
                }

            </motion.div>
        </div>

    </>);
}

export default memo(VehicleModal);