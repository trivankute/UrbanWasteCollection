import { memo, useEffect } from "react";
import { pageMotionTime } from "../../../configs";
import { motion } from 'framer-motion'
import { VehiclesStore, WorkerModalStore } from "../../../redux/selectors";
import { useDispatch, useSelector } from "react-redux";
import WorkerModalSlice from "../../../redux/slices/Modals/WorkerModalSlice";
import TaskChild from "../../ForTaskPage/TaskChild/TaskChild";
import VehicleChild from "../../ForVehiclePage/VehicleChild/VehicleChild";
import { getVehicleById } from "../../../redux/slices/VehiclesSlice";
import Spinner from "../../Spinner/Spinner";

const WorkerModal = () => {
    const dispatch = useDispatch<any>()
    const workerModalIsShow = useSelector(WorkerModalStore).data
    const workerModalData = useSelector(WorkerModalStore).allData
    const vehicle = useSelector(VehiclesStore).vehicle
    useEffect(() => {
        if (workerModalData.vehicleId) {
            dispatch(getVehicleById(workerModalData.vehicleId))
        }
    }, [workerModalData])
    return (<>
        <div className="w-full h-full fixed flex justify-center items-center z-20">
            <div onClick={() => {
                dispatch(WorkerModalSlice.actions.handleClose({}))
            }} className="fixed top-0 bottom-0 left-0 right-0 bg-gray-400 opacity-50"></div>
            <motion.div
                initial={{
                    opacity: 0,
                    y: "10%"
                }}
                animate={{
                    opacity: workerModalIsShow ? 1 : 0,
                    y: workerModalIsShow ? 0 : "10%"
                }}
                exit={{
                    opacity: 0,
                    y: "10%"
                }}
                transition={{
                    duration: pageMotionTime
                }}
                className="w-[100%] max-w-[360px]  sm:max-w-[500px] h-fit fixed -mt-56 shadow-lg space-y-2 overflow-hidden rounded-xl bg-white"
            >
                {
                    workerModalData ?
                        <>
                            <div className="relative w-full flex flex-col max-w-2xl max-h-full z-20  ">
                                <div className="relative bg-white  shadow dark:bg-gray-700">
                                    <div className="flex items-start justify-between p-2 sm:p-4 border-b rounded-t dark:border-gray-600">
                                        <h3 className="text-sm md:text-xl font-semibold text-gray-900 dark:text-white">
                                            Employee view
                                        </h3>
                                        <button
                                            onClick={() => {
                                                dispatch(WorkerModalSlice.actions.handleClose({}))
                                            }}
                                            type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-ant sm:text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="defaultModal">
                                            <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                                            <span className="sr-only">Close modal</span>
                                        </button>
                                    </div>
                                    <div className="p-6 space-y-6">
                                        <div className="w-full h-fit p-4 pt-0 flex items-center justify-between">
                                            <div className="flex-1 h-full flex justify-center items-center">
                                                <img src={workerModalData.image} className="w-10 h-10 sm:w-16 sm:h-16 rounded-full shadow-md" />
                                            </div>
                                            <div className="flex-1 h-full flex flex-col">
                                                <span className="font-semibold capitalize text-ant sm:text-sm">Name: {workerModalData.name}</span>
                                                <span className="text-ant sm:text-sm font-semibold capitailize">Role: {workerModalData.role}</span>
                                                <span className="text-ant sm:text-sm font-semibold capitailize">Tel: <span className="text-ant sm:text-sm font-normal">{workerModalData.phone}</span></span>
                                                <span className="text-ant sm:text-sm font-semibold capitailize">Nationality: <span className="text-ant sm:text-sm font-normal">{workerModalData.nationality}</span></span>
                                                <>
                                                    {
                                                        workerModalData.checkin ?
                                                            <>
                                                                <span className="font-semibold capitalize text-ant sm:text-sm">Checkin: Yes</span>
                                                                <span className="font-semibold capitalize text-ant sm:text-sm">Checkin Time: {workerModalData.checkinTime}</span>
                                                            </>
                                                            :
                                                            <>
                                                                <span className="font-semibold capitalize text-ant sm:text-sm">Checkin: No</span>
                                                            </>
                                                    }
                                                    {
                                                        workerModalData.checkout ?
                                                            <>
                                                                <span className="font-semibold capitalize text-ant sm:text-sm">CheckOut: Yes</span>
                                                                <span className="font-semibold capitalize text-ant sm:text-sm">CheckOut Time: {workerModalData.checkoutTime}</span>
                                                            </>
                                                            :
                                                            <>
                                                                <span className="font-semibold capitalize text-ant sm:text-sm">CheckOut: No</span>
                                                            </>
                                                    }
                                                </>
                                            </div>
                                        </div>
                                        <div className="flex-1 h-full flex flex-col">
                                            <span className="font-semibold capitailize text-ant sm:text-sm">Profile details</span>
                                            <span className="text-ant sm:text-sm font-semibold capitailize">Address: <span className="text-ant sm:text-sm font-normal">{workerModalData.address}</span></span>
                                            <span className="text-ant sm:text-sm font-semibold capitailize">Birthday: <span className="text-ant sm:text-sm font-normal">{workerModalData.birthday}</span></span>
                                            <span className="text-ant sm:text-sm font-semibold capitailize">Email: <span className="text-ant sm:text-sm font-normal">{workerModalData.email}</span></span>
                                            <span className="text-ant sm:text-sm font-semibold capitailize">Gender: <span className="text-ant sm:text-sm font-normal">{workerModalData.gender}</span></span>
                                            <span className="text-ant sm:text-sm font-semibold capitailize">Vehicle: <span className="text-ant sm:text-sm font-normal">{workerModalData.vehicle ? workerModalData.vehicle.numberPlate : "None"}</span></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {
                                workerModalData && workerModalData.vehicleId && workerModalData.vehicle.task && vehicle && vehicle.task &&
                                <div className="w-full h-fit border-t">
                                    <TaskChild task={vehicle.task} />
                                </div>
                            }
                            {
                                workerModalData.vehilceId !== "" && vehicle &&
                                <div className="w-full h-fit border-t">
                                    <VehicleChild data={vehicle} />
                                </div>
                            }
                        </>
                        :
                        <div className="w-full h-[300px] flex justify-center items-center">
                            <Spinner />
                        </div>
                }
            </motion.div >
        </div>
    </>);
}

export default memo(WorkerModal);