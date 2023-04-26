import { AnimatePresence, motion } from "framer-motion";
import { memo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TaskModalStore, TasksStore, UserStore } from "../../../redux/selectors";
import { pageMotionTime } from "../../../configs";
import TaskModalSlice from "../../../redux/slices/Modals/TaskModalslice";
import clsx from "clsx";
import VehicleItem from "../../ForVehiclePage/VehicleItem/VehicleItem";
import WorkerItem from "../../ForVehiclePage/WorkerItem/WorkerItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import TaskMap from "../TaskMap/TaskMap";
import formatTime from "../../../utils/formatTime";
import { searchTasks, taskAnswer, updateTaskToNeedReview } from "../../../redux/slices/TasksSlice";
import Spinner from "../../Spinner/Spinner";
import SmallNotification from "../../../redux/slices/Modals/SmallNotificationSlice";

function TaskModal() {
    const [routeMcp, setRouteMcp] = useState(false)
    const taskModalIsShow = useSelector(TaskModalStore).show
    const taskModalData = useSelector(TaskModalStore).task
    const taskLoading = useSelector(TasksStore).loading
    const dispatch = useDispatch<any>()
    const user = useSelector(UserStore).data
    return (<>
        <div className="w-full h-full fixed flex justify-center items-center  z-30">
            <div onClick={() => {
                dispatch(TaskModalSlice.actions.handleClose({}))
                setRouteMcp(false)
            }} className="w-full h-full fixed bg-gray-400 opacity-50">
            </div>
            <motion.div
                key="main"
                initial={{
                    opacity: 0,
                    y: "10%"
                }}
                animate={{
                    opacity: taskModalIsShow ? 1 : 0,
                    y: taskModalIsShow ? 0 : "10%"
                }}
                exit={{
                    opacity: 0,
                    y: "10%"
                }}
                transition={{
                    duration: pageMotionTime
                }}
                className="w-[100%] max-w-[380px] sm:max-w-[600px] h-fit fixed -mt-32  shadow-md "
            >
                <div className="relative bg-white rounded-lg overflow-hidden w-full max-h-full flex ">
                    <AnimatePresence mode="wait">
                        {
                            !routeMcp ?
                                <motion.div
                                    key="page1"
                                    initial={{
                                        x: 0, y: 0
                                    }}
                                    exit={{
                                        x: "-100%",
                                        y: 0,
                                    }}
                                    className="relative  w-full flex flex-col dark:bg-gray-600">
                                    <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                            Task Detail
                                        </h3>
                                        <button
                                            onClick={() => {
                                                dispatch(TaskModalSlice.actions.handleClose({}))
                                                setRouteMcp(false)
                                            }}
                                            type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="defaultModal">
                                            <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                                            <span className="sr-only">Close modal</span>
                                        </button>
                                    </div>
                                    <div className="p-2 sm:p-6 space-y-4 w-full border-b">
                                        <div className="w-full h-fit flex justify-around">
                                            <span className="text-sm font-semibold">Task name: <span className="text-sm font-normal">{taskModalData.name}</span></span>
                                            <span className="text-sm font-semibold">State: <span className={clsx("text-sm font-normal capitalize", {
                                                "text-blue-400": taskModalData.state === "done",
                                                "text-yellow-400": taskModalData.state === "need review",
                                                "text-green-400": taskModalData.state === "in progress"
                                            })}>
                                                {taskModalData.state}
                                            </span></span>
                                            <div className="flex items-center">
                                                <span className="text-sm font-semibold flex justify-center items-center">Type: </span>
                                                <div className={clsx("ml-2 w-20 h-fit rounded-xl text-white text-sm font-semibold capitalize flex justify-center items-center", {
                                                    "bg-green-400": taskModalData.type === "collector",
                                                    "bg-red-400": taskModalData.type === "janitor",
                                                })}>{taskModalData.type}</div>
                                            </div>
                                        </div>
                                        <div className="w-full h-fit flex space-y-2 flex-col">
                                            <span className="text-sm font-semibold">Started: <span className="text-sm font-normal">{formatTime(taskModalData.createdAt)}</span></span>
                                            {
                                                taskModalData.state === "need review" ?
                                                    <span className="text-sm font-semibold">Triggered: <span className="text-sm font-normal">{formatTime(taskModalData.updatedAt)}</span></span>
                                                    :
                                                    taskModalData.state === "done" ?
                                                        <span className="text-sm font-semibold">End: <span className="text-sm font-normal">{formatTime(taskModalData.doneAt)}</span></span>
                                                        :
                                                        <></>
                                            }
                                        </div>
                                        <div className="w-full h-fit flex space-y-2 flex-col">
                                            {
                                                taskModalData.state !== "done" && taskModalData.vehicle &&
                                                <>
                                                    <span className="text-sm font-semibold">Vehicle:</span>
                                                    <VehicleItem data={taskModalData.vehicle} />
                                                </>
                                            }
                                        </div>
                                        <div className="w-full h-fit flex space-y-2 flex-col">
                                            {
                                                taskModalData.state !== "done" && taskModalData.vehicle &&
                                                <>
                                                    <span className="text-sm font-semibold">Workers:</span>
                                                    {taskModalData.vehicle.workers.map((worker: any, index: number) => {
                                                        return (
                                                            <WorkerItem data={{vehicle:taskModalData.vehicle, ...worker}} key={index} />
                                                        )
                                                    })}
                                                </>
                                            }
                                        </div>
                                    </div>
                                    <div onClick={() => {
                                        setRouteMcp(true)
                                    }} className="group p-4 cursor-pointer flex items-center justify-end ml-auto">
                                        <div className="group-hover:text-green-500 flex space-x-2 justify-between items-center">
                                            <span className="text-ant sm:text-base">
                                                {
                                                    taskModalData.state === "in progress" ?
                                                        "Routes And MCPs"
                                                        :
                                                        taskModalData.state === "need review" ?
                                                            "Routes, MCPs and Review"
                                                            :
                                                            "Routes And MCPs"
                                                }

                                            </span>
                                            <FontAwesomeIcon icon={faArrowRight as IconProp} className='group-hover:text-green-500 cursor-pointer hover:text-green-400 w-4 h-4 text-gray-500' />
                                        </div>
                                    </div>
                                </motion.div>
                                :
                                <motion.div
                                    key="page2"
                                    initial={{
                                        x: 0, y: 0
                                    }}
                                    exit={{
                                        x: "100%", y: 0
                                    }}
                                    className="relative w-full max-h-[750px] overflow-y-auto h-fit flex flex-col dark:bg-gray-600">
                                    <div className="flex items-start justify-between p-2 border-b rounded-t dark:border-gray-600">
                                        <div onClick={() => {
                                            setRouteMcp(false)
                                        }} className="group p-4 cursor-pointer flex items-center justify-end mr-auto">
                                            <div className="group-hover:text-green-500 flex space-x-2 justify-between items-center">
                                                <FontAwesomeIcon icon={faArrowLeft as IconProp} className='group-hover:text-green-500 cursor-pointer hover:text-green-400 w-4 h-4 text-gray-500' />
                                                <span className="text-ant sm:text-base">
                                                    Back
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => {
                                                dispatch(TaskModalSlice.actions.handleClose({}))
                                                setRouteMcp(false)
                                            }}
                                            type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="defaultModal">
                                            <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                                            <span className="sr-only">Close modal</span>
                                        </button>
                                    </div>
                                    <div className="p-2 sm:p-6 space-y-4 w-full">
                                        {
                                            taskModalData && taskModalData.disposalFactories && taskModalData.disposalFactories.length === 1 ?
                                                <>
                                                    <div className="w-full h-fit text-ant sm:text-base font-semibold">Departure and arrival disposal: {taskModalData.disposalFactories[0].name}</div>
                                                </>
                                                :
                                                <>
                                                    <div className="w-full h-fit text-ant sm:text-base font-semibold">Departure disposal: {taskModalData.disposalFactories[1].name}</div>
                                                    <div className="w-full h-fit text-ant sm:text-base font-semibold">Arrival disposal: {taskModalData.disposalFactories[0].name}</div>
                                                </>
                                        }

                                        <div className="w-full h-fit text-ant sm:text-base font-semibold">Routes And Current Location with red is departure and green is arrival: </div>
                                        <TaskMap state={taskModalData.state} routes={taskModalData.routes} mcps={taskModalData.mcps} disposalFactories={taskModalData.disposalFactories}
                                            vehicle={taskModalData.vehicle} />
                                        {
                                            taskModalData.state !== "in progress" ?
                                                <>
                                                    {
                                                        taskModalData.mcps.map((mcp: any, index: number) => {
                                                            return (
                                                                <>
                                                                    <div className="w-full h-fit flex flex-col space-y-2">
                                                                        <span className="w-full h-fit text-ant sm:text-base font-semibold">MCP {mcp.name}'s capacity before: <span className="font-normal">{taskModalData.mcpPreviousCapacitys[index]}%</span></span>
                                                                    </div>
                                                                    <div className="w-full h-fit flex flex-col space-y-2">
                                                                        <span className="w-full h-fit text-ant sm:text-base font-semibold">MCP {mcp.name}'s capacity after: <span className="font-normal">{taskModalData.mcpResultCapacitys[index]}%</span></span>
                                                                    </div>
                                                                </>
                                                            )
                                                        })
                                                    }
                                                </>
                                                :
                                                <>
                                                    {
                                                        taskModalData.mcps.map((mcp: any, index: number) => {
                                                            return (
                                                                <>
                                                                    <div className="w-full h-fit flex flex-col space-y-2">
                                                                        <span className="w-full h-fit text-ant sm:text-base font-semibold">MCP {mcp.name}'s capacity before: <span className="font-normal">{taskModalData.mcpPreviousCapacitys[index]}%</span></span>
                                                                    </div>
                                                                </>
                                                            )
                                                        })
                                                    }
                                                </>
                                        }
                                    </div>
                                    {
                                        taskModalData.state === "need review" && user.role === "backofficer" &&
                                        <div className="p-4 flex items-center justify-end border-t space-x-4">
                                            <div onClick={() => {
                                                dispatch(taskAnswer({
                                                    id: taskModalData.id,
                                                    answer: "refuse"
                                                }))
                                                    .then((res: any) => {
                                                        dispatch(TaskModalSlice.actions.handleClose({}))
                                                        dispatch(SmallNotification.actions.handleOpen({ type: "success", content: "Task refused" }))
                                                        dispatch(searchTasks(
                                                            {
                                                                "page": 1,
                                                                "pageSize": 20,
                                                                "name": "",
                                                                "type": "",
                                                                "state": "",
                                                                "disposalName": "",
                                                                "mcpName": ""
                                                            }))
                                                    })
                                            }} className="w-20 min-w-20 h-fit p-2 rounded-lg font-semibold text-white bg-red-400 cursor-pointer hover:bg-red-300 flex justify-center items-center">
                                                {
                                                    taskLoading ?
                                                        <Spinner />
                                                        :
                                                        "Refuse"
                                                }
                                            </div>
                                            <div onClick={() => {
                                                dispatch(taskAnswer({
                                                    id: taskModalData.id,
                                                    answer: "accept"
                                                }))
                                                    .then((res: any) => {
                                                        dispatch(TaskModalSlice.actions.handleClose({}))
                                                        dispatch(SmallNotification.actions.handleOpen({ type: "success", content: "Task accepted" }))
                                                        dispatch(searchTasks(
                                                            {
                                                                "page": 1,
                                                                "pageSize": 20,
                                                                "name": "",
                                                                "type": "",
                                                                "state": "done",
                                                                "disposalName": "",
                                                                "mcpName": ""
                                                            }))
                                                    })
                                            }} className="w-20 min-w-20 h-fit p-2 rounded-lg font-semibold text-white bg-green-400 cursor-pointer hover:bg-green-300 flex justify-center items-center">
                                                {
                                                    taskLoading ?
                                                        <Spinner />
                                                        :
                                                        "Accept"
                                                }
                                            </div>
                                        </div>
                                    }
                                    {
                                        taskModalData.state === "in progress" && (user.role === "janitor" || user.role === "collector") &&
                                        <div className="p-4 flex items-center justify-end border-t space-x-4">
                                            <div onClick={() => {
                                                dispatch(updateTaskToNeedReview(taskModalData.id))
                                                    .then((res: any) => {
                                                        if (res.payload.status === "success") {
                                                            dispatch(TaskModalSlice.actions.handleClose({}))
                                                            dispatch(SmallNotification.actions.handleOpen({ type: "success", content: "Send task to backofficer" }))
                                                        }
                                                        else {
                                                            dispatch(SmallNotification.actions.handleOpen({ type: "error", content: res.payload.message }))
                                                        }
                                                    })
                                            }} className="w-fit min-w-20 h-fit p-2 rounded-lg font-semibold text-white bg-green-400 cursor-pointer hover:bg-green-300 flex justify-center items-center">
                                                {
                                                    taskLoading ?
                                                        <Spinner />
                                                        :
                                                        "Send need review"
                                                }
                                            </div>
                                        </div>
                                    }
                                </motion.div>
                        }
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    </>);
}

export default memo(TaskModal);