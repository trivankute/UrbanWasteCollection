import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { memo, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { pageMotionTime } from '../../configs';
import { motion } from 'framer-motion';
import ListFilter from '../../Components/ListFilter/ListFilter';
import VehicleChildList from '../../Components/ForTaskAddPage/VehicleChildList/VehicleChildList';
import { useDispatch, useSelector } from 'react-redux';
import { TasksStore, VehiclesStore } from '../../redux/selectors';
import { handleSearchVehicle } from '../../redux/slices/VehiclesSlice';
import TaskAddMap from '../../Components/ForTaskAddPage/TaskAddMap/TaskAddMap';
import CalendarForChoose from '../../Components/ForTaskAddPage/CalendarForChoose/CalendarForChoose';
import formatTime from '../../utils/formatTime';
import { createTask, searchTasks } from '../../redux/slices/TasksSlice';
import SmallNotification from '../../redux/slices/Modals/SmallNotificationSlice';
import Spinner from '../../Components/Spinner/Spinner';

function TaskAddPage() {
    const [type, setType] = useState("")
    const [taskName, setTaskName] = useState("")
    const [disposalBefore, setDisposalBefore] = useState<any>(null)
    const [disposalAfter, setDisposalAfter] = useState<any>(null)
    const [mcps, setMcps] = useState<any>(null)
    const [routes, setRoutes] = useState<any>(null)
    const [time, setTime] = useState<any>(null)
    const navigate = useNavigate();
    const dispatch = useDispatch<any>()
    const vehicles = useSelector(VehiclesStore).vehicles
    const [vehicle, setVehicle] = useState<any>(() => {
        const newVehicles = vehicles ? vehicles.filter((item: any) => {
            if (item.state === "nothing" && item.workers.length > 0)
                return item
        }) : null
        if (newVehicles && newVehicles.length > 0)
            return newVehicles[0]
        else
            return null
    })
    useEffect(() => {
        dispatch(handleSearchVehicle(
            {
                "page": 1,
                "pageSize": 20,
                "numberPlate": "",
                "type": type,
                "state": "",
                "disposalName": disposalBefore ? disposalBefore.name : "",
            }
        ))
    }, [type, (disposalBefore && disposalBefore.name)])
    const tasksLoading = useSelector(TasksStore).loading
    async function handleSubmit() {
        if (!taskName || !vehicle || !disposalBefore || !disposalAfter || !mcps || !routes || !time) {
            dispatch(SmallNotification.actions.handleOpen({ type: "error", content: "Please fill all fields" }))
            return
        }
        else
            dispatch(createTask(
                {
                    "name": taskName,
                    "type": vehicle.type,
                    "vehicleId": vehicle.id,
                    "routes": routes.map((route: any) => JSON.stringify(route)),
                    "pathDisposalFactoriesIds": [
                        {
                            "id": disposalBefore.id
                        },
                        {
                            "id": disposalAfter.id
                        }
                    ],
                    "mcpIds": mcps.map((mcp: any) => {
                        return {
                            "id": mcp.id
                        }
                    }),
                    "createdTime": time
                }
            ))
                .then((res: any) => {
                    if (res.payload.status === "success") {
                        navigate('/admin/tasks')
                        dispatch(SmallNotification.actions.handleOpen({ type: "success", content: "Task created successfully" }))
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
                    }
                    else
                        dispatch(SmallNotification.actions.handleOpen({ type: "error", content: "Task created failed" }))
                })
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
            className="w-full h-fit p-8 rounded-xl bg-white flex flex-col space-y-4">

            <div onClick={() => {
                navigate('/admin/tasks')
            }} className="group p-4 cursor-pointer flex items-center mr-auto">
                <div className="group-hover:text-green-500 flex space-x-2 justify-between items-center">
                    <FontAwesomeIcon icon={faArrowLeft as IconProp} className='group-hover:text-green-500 cursor-pointer hover:text-green-400 w-4 h-4 text-gray-500' />
                    <span className="text-base capitalize">
                        Task page
                    </span>
                </div>
            </div>
            <span className="font-semibold text-base">Task name:</span>
            <input value={taskName} onChange={(e) => {
                setTaskName(e.target.value)
            }} className="w-full h-10 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-green-400 p-2" />

            <span className="font-semibold text-base">Select DisposalName and MCPs with red is departure and green is arrival:</span>
            <div className="w-full h-fit flex justify-center items-center">
                <TaskAddMap setDisposalBefore={setDisposalBefore} setDisposalAfter={setDisposalAfter} setMcpsForAdd={setMcps}
                    setRoutesForAdd={setRoutes} />
            </div>
            <span className="font-semibold text-base">Select Available Vehicle From That Disposal:</span>
            <div className="w-full h-fit flex items-center space-x-2">
                <span className="font-semibold text-base">Type:</span>
                <ListFilter setState={setType} ListArrayText={["type", "janitor", "collector"]} />
            </div>
            <VehicleChildList vehicle={vehicle} setVehicle={setVehicle} vehicles={vehicles} />
            {
                disposalBefore &&
                <span className="font-semibold text-base">Departure Disposal: {disposalBefore.name}</span>
            }
            {
                disposalAfter &&
                <span className="font-semibold text-base">Arrival Disposal: {disposalAfter.name}</span>
            }
            {
                mcps && mcps.map((mcp:any, index:number)=>{
                    return (
                    <div className="w-full h-fit">
                        <span className="font-semibold text-base">MCP Before: </span>
                        <span className="font-semibold text-base ml-4">+ MCP Name: {mcp.name}, capacity: {mcp.capacity}%</span>
                    </div>)
                })
            }
            <CalendarForChoose taskName={taskName} time={time} setTime={setTime} />
            <span className="font-semibold text-base">Thời gian bắt đầu: {time && formatTime(time)}</span>
            <div onClick={handleSubmit} className="mx-auto w-20 min-w-20 h-fit p-2 rounded-lg font-semibold text-white bg-green-400 cursor-pointer hover:bg-green-300 flex justify-center items-center">
                {
                    tasksLoading ?
                        <Spinner />
                        :
                        "Submit"
                }
            </div>
        </motion.div>
    </>);
}

export default memo(TaskAddPage);