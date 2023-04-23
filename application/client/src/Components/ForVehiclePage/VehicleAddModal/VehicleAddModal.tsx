import { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DisposalsStore, VehicleAddModalStore, VehiclesStore } from "../../../redux/selectors";
import { motion } from "framer-motion";
import VehicleAddModalSlice from "../../../redux/slices/Modals/VehicleAddModalSlice";
import { pageMotionTime } from "../../../configs";
import xerac from '../../../assets/vehicles/xerac.jpg'
import { getAllDisposals } from "../../../redux/slices/DisposalsSlice";
import ListFilter from "../../ListFilter/ListFilter";
import { addVehicle, handleSearchVehicle } from "../../../redux/slices/VehiclesSlice";
import SmallNotification from "../../../redux/slices/Modals/SmallNotificationSlice";
import Spinner from "../../Spinner/Spinner";

function VehicleAddModal() {
    const dispatch = useDispatch<any>()
    const vehicleAddModalIsShow = useSelector(VehicleAddModalStore).data
    const [disposalName, setDisposalName] = useState("")
    const [numberPlate, setNumberPlate] = useState("")
    const disposals = useSelector(DisposalsStore).disposals
    const vehicleLoading = useSelector(VehiclesStore).loading
    useEffect(() => {
        dispatch(getAllDisposals())
    }, [])
    return (<>
        <div className="w-full h-full fixed flex justify-center items-center">
            <div onClick={() => {
                dispatch(VehicleAddModalSlice.actions.handleClose({}))
            }} className="w-full h-full fixed bg-gray-400 opacity-50">
            </div>
            <motion.div
                initial={{
                    opacity: 0,
                    y: "10%"
                }}
                animate={{
                    opacity: vehicleAddModalIsShow ? 1 : 0,
                    y: vehicleAddModalIsShow ? 0 : "10%"
                }}
                exit={{
                    opacity: 0,
                    y: "10%"
                }}
                transition={{
                    duration: pageMotionTime
                }}
                className="w-[100%] max-w-[500px] h-fit fixed -mt-56 shadow-lg"
            >
                <div className="relative w-full max-w-2xl max-h-full z-10">
                    <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                        <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Add new vehicle
                            </h3>
                            <button
                                onClick={() => {
                                    dispatch(VehicleAddModalSlice.actions.handleClose({}))
                                }}
                                type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="defaultModal">
                                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="w-full h-fit p-4 pt-0 flex items-center justify-between">
                                <div className="flex-1 h-full flex justify-center items-center">
                                    <img src={xerac} className="w-16 h-16 rounded-full shadow-md" />
                                </div>
                                <div className="flex-1 h-full flex flex-col justify-center items-start gap-y-2 ">
                                    <span className="font-normal capitalize text-sm">Enter the vehicle’s NumberPlate</span>
                                    <span className="text-sm font-normal flex items-center">NumberPlate
                                        <input onChange={(e: any) => {
                                            setNumberPlate(e.target.value)
                                        }} type="text" value={numberPlate} className="border-1 ml-2 border-black p-1 rounded-xl" />
                                    </span>
                                    <ListFilter setState={setDisposalName} ListArrayText={disposals ? ["Select disposal", ...disposals.map((item: any) => item.name)] : ["Nothing"]} />
                                    <button onClick={() => {
                                        if (numberPlate !== "" && disposalName !== "")
                                            dispatch(addVehicle({
                                                "numberPlate": numberPlate,
                                                "disposalName": disposalName
                                            })).then((res: any) => {
                                                    if (res.payload.status === "success") {
                                                        dispatch(VehicleAddModalSlice.actions.handleClose({}))
                                                        dispatch(SmallNotification.actions.handleOpen({ type: "success", content: "Vehicle added successfully" }))
                                                        dispatch(handleSearchVehicle(
                                                            {
                                                                "page":1,
                                                                "pageSize":20,
                                                                "numberPlate":"",
                                                                "type":"",
                                                                "state":"",
                                                                "disposalName":""
                                                            }
                                                        ))
                                                    }
                                                })
                                        else
                                            dispatch(SmallNotification.actions.handleOpen({ type: "error", content: "Please fill all fields" }))
                                    }} className="w-20 h-fit p-2 rounded-xl mt-2 bg-green-400 text-sm text-white flex justify-center items-center">
                                        {
                                            vehicleLoading ?
                                                <Spinner />
                                                :
                                                "+ Add"
                                        }
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    </>);
}

export default memo(VehicleAddModal);