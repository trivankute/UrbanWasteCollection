import { AnimatePresence, motion } from "framer-motion";
import { memo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { VehicleModalStore } from "../../../redux/selectors";
import VehicleModalSlice from "../../../redux/slices/Modals/VehicleModalSlice";
import { pageMotionTime } from "../../../configs";
import xerac from '../../../assets/vehicles/xerac.jpg'
import SearchBar from "../../SearchBar/SearchBar";
import ListFilter from "../../ListFilter/ListFilter";
import WorkerItem from "../WorkerItem/WorkerItem";
import clsx from "clsx";

function VehicleModal() {
    const [adjust, isAdjust] = useState(false)
    const vehicleModalIsShow = useSelector(VehicleModalStore).data
    const dispatch = useDispatch<any>()
    return (<>
        <AnimatePresence mode="wait">
            {
                vehicleModalIsShow &&
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
                        className="w-[100%] max-w-[360px] sm:max-w-[800px] h-fit max-h-[500px] sm:max-h-full overflow-y-auto fixed -mt-20 shadow-lg"
                    >
                        <div className="relative rounded-lg overflow-hidden w-full max-h-full z-10 flex flex-col md:flex-row">
                            <div className="flex flex-col flex-1 bg-white">
                                <div className="relative dark:bg-gray-600">
                                    <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                            Vehicle Detail
                                        </h3>
                                        <button
                                        onClick={() => {
                                            dispatch(VehicleModalSlice.actions.handleClose({}))
                                        }}
                                        type="button" className="text-gray-400 bg-transparent sm:hidden hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="defaultModal">
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
                                                <span className="font-semibold capitalize text-sm">Vehicle number 1</span>
                                                <span className="text-sm font-semibold">Capacity: <span className="text-sm font-normal">50%</span></span>
                                                <span className="text-sm font-semibold">License: <span className="text-sm font-normal">113114115</span></span>
                                                <span className="text-sm font-semibold">Fule: <span className="text-sm font-normal">50%</span></span>
                                            </div>
                                        </div>
                                        <div className="w-full h-fit p-4 pt-0 flex items-center justify-between">
                                            <div className="flex-1 h-full flex flex-col justify-center items-start gap-y-0 ">
                                                <span className="text-sm font-semibold">Task name: <span className="text-sm font-normal"> bla bla</span></span>
                                                <span className="text-sm font-semibold">State: <span className="text-sm font-normal">Nothing</span></span>
                                                <div className="flex items-center mt-1 w-full">
                                                    <span className="text-sm font-semibold flex justify-center items-center">Type: </span>
                                                    <div className="ml-2 w-20 h-fit rounded-xl bg-green-400 text-white text-sm font-semibold capitailize flex justify-center items-center">Janitor</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full h-fit p-4 pt-2">
                                    <div className="flex w-full justify-between items-center">
                                        <span className="text-sm font-semibold">
                                            Number: 2/4 Workers
                                        </span>
                                        <span onClick={()=>{
                                            isAdjust(!adjust)
                                        }} className={clsx("text-sm font-semibold capitalize cursor-pointer",{
                                            "text-green-500": adjust,
                                        })}>{adjust?"Adjust Mode":"Click to adjust"}</span>
                                    </div>
                                    <div className="w-full p-2"></div>
                                    <div className="space-y-2">
                                        <WorkerItem type="workers"/>
                                        <WorkerItem type="workers"/>
                                        <WorkerItem type="nothing"/>
                                        <WorkerItem type="nothing"/>
                                    </div>
                                </div>
                            </div>
                            <div className="relative flex-1 bg-white border-l dark:bg-gray-700">
                                <div className="flex items-start justify-between p-4 pb-0 rounded-t gap-x-2">
                                    <SearchBar />
                                    <button
                                        onClick={() => {
                                            dispatch(VehicleModalSlice.actions.handleClose({}))
                                        }}
                                        type="button" className="text-gray-400 hidden sm:inline-flex bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="defaultModal">
                                        <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                                        <span className="sr-only">Close modal</span>
                                    </button>
                                </div>
                                <div className="flex items-start justify-between p-4 rounded-t w-full">
                                    <ListFilter ListArrayText={["type worker", "janitor", "collector"]} />
                                </div>
                                <div className="p-6 space-y-2 max-h-[500px] overflow-y-auto">
                                    <WorkerItem type="workers"/>
                                    <WorkerItem type="workers"/>
                                    <WorkerItem type="workers"/>
                                    <WorkerItem type="workers"/>
                                    <WorkerItem type="workers"/>
                                    <WorkerItem type="workers"/>
                                    <WorkerItem type="workers"/>
                                </div>
                            </div>

                        </div>

                    </motion.div>
                </div>
            }
        </AnimatePresence>

    </>);
}

export default memo(VehicleModal);