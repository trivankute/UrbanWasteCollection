import { AnimatePresence, motion } from "framer-motion";
import { memo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TaskModalStore } from "../../../redux/selectors";
import { pageMotionTime } from "../../../configs";
import TaskModalSlice from "../../../redux/slices/Modals/TaskModalslice";
import clsx from "clsx";
import VehicleItem from "../../ForVehiclePage/VehicleItem/VehicleItem";
import WorkerItem from "../../ForVehiclePage/WorkerItem/WorkerItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import TaskMap from "../TaskMap/TaskMap";

function TaskModal() {
    const [routeMcp, setRouteMcp] = useState(false)
    const taskModalIsShow = useSelector(TaskModalStore).show
    const taskModalData = useSelector(TaskModalStore).data
    const dispatch = useDispatch<any>()
    return (<>
        <AnimatePresence mode="wait">
            {
                taskModalIsShow &&
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
                        className="w-[100%] max-w-[360px] sm:max-w-[600px] h-fit fixed -mt-32  shadow-md "
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
                                            <div className="p-6 space-y-4 w-full border-b">
                                                <div className="w-full h-fit flex justify-around">
                                                    <span className="text-sm font-semibold">Task name: <span className="text-sm font-normal"> bla bla</span></span>
                                                    <span className="text-sm font-semibold">State: <span className={clsx("text-sm font-normal capitalize", {
                                                        "text-blue-400": taskModalData.type === "done",
                                                        "text-yellow-400": taskModalData.type === "need review",
                                                        "text-green-400": taskModalData.type === "in progress"
                                                    })}>
                                                        {taskModalData.type}
                                                    </span></span>
                                                    <div className="flex items-center">
                                                        <span className="text-sm font-semibold flex justify-center items-center">Type: </span>
                                                        <div className="ml-2 w-20 h-fit rounded-xl bg-green-400 text-white text-sm font-semibold capitailize flex justify-center items-center">Janitor</div>
                                                    </div>
                                                </div>
                                                <div className="w-full h-fit flex space-y-2 flex-col">
                                                    <span className="text-sm font-semibold">Started: <span className="text-sm font-normal"> 10pm 25/2/2023</span></span>
                                                    {
                                                        taskModalData.type === "need review" ?
                                                            <span className="text-sm font-semibold">Triggered: <span className="text-sm font-normal"> 10pm 25/2/2023</span></span>
                                                            :
                                                            taskModalData.type === "done" ?
                                                                <span className="text-sm font-semibold">End: <span className="text-sm font-normal"> 10pm 25/2/2023</span></span>
                                                                :
                                                                <></>
                                                    }
                                                </div>
                                                <div className="w-full h-fit flex space-y-2 flex-col">
                                                    <span className="text-sm font-semibold">Vehicle:</span>
                                                    <VehicleItem />
                                                </div>
                                                <div className="w-full h-fit flex space-y-2 flex-col">
                                                    <span className="text-sm font-semibold">Workers:</span>
                                                    <WorkerItem type="workers" />
                                                    <WorkerItem type="workers" />
                                                    <WorkerItem type="workers" />
                                                    <WorkerItem type="workers" />
                                                </div>
                                            </div>
                                            <div onClick={() => {
                                                setRouteMcp(true)
                                            }} className="group p-4 cursor-pointer flex items-center justify-end ml-auto">
                                                <div className="group-hover:text-green-500 flex space-x-2 justify-between items-center">
                                                    <span className="text-base">
                                                        {
                                                            taskModalData.type === "in progress" ?
                                                                "Routes And MCPs"
                                                                :
                                                                taskModalData.type === "need review" ?
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
                                                        <span className="text-base">
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
                                            <div className="p-6 space-y-4 w-full">
                                                <div className="w-full h-fit p-2 text-base">Disposal: A</div>

                                                <div className="w-full h-fit text-base">Routes And Current Location: </div>
                                                <TaskMap/>

                                                    <div className="w-full h-fit flex flex-col space-y-2">
                                                        <span className="w-full h-fit text-base">MCPs Before: </span>
                                                        <span className="w-full h-fit text-base ml-4">+ MCPid: 2 Đại học Bách Khoa, capacity: 90%</span>
                                                        <span className="w-full h-fit text-base ml-4">+ MCPid: 2, Đại học Bách Khoa, capacity: 90%</span>
                                                    </div>
                                                {
                                                    taskModalData.type !== "in progress" &&
                                                    <div className="w-full h-fit flex flex-col space-y-2">
                                                        <span className="w-full h-fit text-base">MCPs Before: </span>
                                                        <span className="w-full h-fit text-base mml-4">+ MCPid: 2 Đại học Bách Khoa, capacity: 90%</span>
                                                        <span className="w-full h-fit text-base mml-4">+ MCPid: 2, Đại học Bách Khoa, capacity: 90%</span>
                                                    </div>
                                                }
                                            </div>
                                            {
                                                taskModalData.type === "need review" &&
                                                <div onClick={() => {
                                                    setRouteMcp(true)
                                                }} className="p-4 flex items-center justify-end border-t space-x-4">
                                                    <div className="w-20 min-w-20 h-fit p-2 rounded-lg font-semibold text-white bg-red-400 cursor-pointer hover:bg-red-300 flex justify-center items-center">
                                                        Refuse
                                                    </div>
                                                    <div className="w-20 min-w-20 h-fit p-2 rounded-lg font-semibold text-white bg-green-400 cursor-pointer hover:bg-green-300 flex justify-center items-center">
                                                        Accept
                                                    </div>
                                                </div>
                                            }
                                        </motion.div>
                                }
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>
            }
        </AnimatePresence>
    </>);
}

export default memo(TaskModal);