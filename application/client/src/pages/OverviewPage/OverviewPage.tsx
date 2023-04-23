import { memo, useState, useRef, useEffect } from 'react'
import { pageMotionTime } from '../../configs';
import { motion } from 'framer-motion';
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { formatDate } from '@fullcalendar/core';
import TaskChild from '../../Components/ForTaskPage/TaskChild/TaskChild';
import { ResponsiveStore, TasksStore, UserStore, VehiclesStore } from '../../redux/selectors';
import { useDispatch, useSelector } from 'react-redux';
import { getTaskById, searchTasks } from '../../redux/slices/TasksSlice';
import clsx from 'clsx';
import Spinner from '../../Components/Spinner/Spinner';
import VehicleChild from '../../Components/ForVehiclePage/VehicleChild/VehicleChild';
import { getVehicleById, resetVehicleHandle } from '../../redux/slices/VehiclesSlice';
import SmallNotification from '../../redux/slices/Modals/SmallNotificationSlice';
function OverviewPage() {
    let mainRef = useRef<any>()
    const dispatch = useDispatch<any>()
    const task = useSelector(TasksStore).task
    const taskLoading = useSelector(TasksStore).loading
    const tasks = useSelector(TasksStore).tasks
    const user = useSelector(UserStore).data
    const vehicle = useSelector(VehiclesStore).vehicle
    const vehicleLoading = useSelector(VehiclesStore).loading
    function fromTaskTimeToCalendarTime(time: string) {
        const originalDateStr = time;
        const originalDate = new Date(originalDateStr);
        const updatedDateStr = originalDate.toISOString();
        const truncatedDateStr = updatedDateStr.slice(0, -5);
        return truncatedDateStr;
    }

    function renderEventContent(eventInfo: any) {
        // RoadId : 120 - Distance : 9km
        const title = eventInfo.event.title
        const state = eventInfo.event._def.extendedProps.state
        const type = eventInfo.event._def.extendedProps.type

        return (
            <>
                <div className={clsx("d-flex justify-content-center flex-column text-ant")}>
                    {/* Start time and end time */}
                    {
                        state === "done" ?
                            <div className="flex space-x-2">
                                <div><b>Start: {formatDate(eventInfo.event.start, { hour: 'numeric', minute: 'numeric' })}</b></div>
                                <div><b>End: {formatDate(eventInfo.event.end, { hour: 'numeric', minute: 'numeric' })}</b></div>
                            </div>
                            :
                            <div><b>Start: {formatDate(eventInfo.event.start, { hour: 'numeric', minute: 'numeric' })}</b></div>
                    }
                    <div className="capitalize">title: {title}</div>
                    <div className="capitalize">state: {state}</div>
                    <div className="capitalize">type: {type}</div>
                </div>
            </>
        )
    }

    const isResponsive = useSelector(ResponsiveStore).data

    useEffect(() => {
        if (user.role === "backofficer")
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
        else if ((user.role === "janitor" || user.role === "collector") && user.vehicle && user.vehicle.task) {
            dispatch(getTaskById(user.vehicle.task.id))
            dispatch(getVehicleById(user.vehicle.id))
        }
    }, [])
    console.log(vehicleLoading)
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
            {
                (user.role==="janitor"||user.role==="collector") && 
                <>
                <span className="text-base font-semibold w-full h-fit">
                    This is your vehicle:
                </span>
                {
                    vehicleLoading ?
                    <>
                    <div className="w-full h-fit flex justify-center items-center">
                        <Spinner/>  
                    </div>
                    </>
                    :
                    <>
                        {vehicle ?
                        <div className="flex flex-col w-full h-fit space-y-4">
                        <VehicleChild data={vehicle}/>
                        <button onClick={()=>{
                            dispatch(resetVehicleHandle(user.vehicle.id))
                            .then((res:any)=>{
                                if(res.payload.status==="success"){
                                    dispatch(SmallNotification.actions.handleOpen({type:"success", content:"Refuel and recapacity successfully"}))
                                }
                                else{
                                    dispatch(SmallNotification.actions.handleOpen({type:"error", content:res.payload.message}));
                                }
                            })
                        }} className="h-fit w-fit p-4 rounded-xl bg-orange-400 hover:bg-orange-500 shadow-md text-white capitalize">Refuel and recapacity</button>
                        </div>
                        :
                        <span className="text-base font-semibold w-full h-fit">
                            You are not belong to any vehicle, please contact your manager.
                        </span>
                        }
                    </>
                }
                </>
            }
            <span className="text-base font-semibold w-full h-fit">
                Click on task to see in detail:
            </span>
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView={"timeGridWeek"}
                headerToolbar={{
                    start: "timeGridWeek,dayGridMonth", // will normally be on the left. if RTL, will be on the right
                    center: 'title',
                    end: 'prev,next' // will normally be on the right. if RTL, will be on the left
                }}
                editable={false}
                selectable={false}
                selectMirror={true}
                dayMaxEvents={true}
                contentHeight={isResponsive ? "300px" : "auto"} // 
                weekends={true}
                themeSystem="bootstrap"
                events={
                    user.role === "backofficer" ?

                        tasks && tasks.map((item: any, index: number) => {
                            if (item.state !== "done")
                                return {
                                    title: item.name,
                                    type: item.type,
                                    state: item.state,
                                    taskId: item.id,
                                    start: fromTaskTimeToCalendarTime(item.createdAt),
                                }
                            else {
                                return {
                                    title: item.name,
                                    type: item.type,
                                    state: item.state,
                                    taskId: item.id,
                                    start: fromTaskTimeToCalendarTime(item.createdAt),
                                    end: fromTaskTimeToCalendarTime(item.updatedAt),
                                }
                            }
                        })
                        :

                        task &&
                        [task.state !== "done" ? {
                            title: task.name,
                            type: task.type,
                            state: task.state,
                            taskId: task.id,
                            start: fromTaskTimeToCalendarTime(task.createdAt),
                        } :
                            {
                                title: task.name,
                                type: task.type,
                                state: task.state,
                                taskId: task.id,
                                start: fromTaskTimeToCalendarTime(task.createdAt),
                                end: fromTaskTimeToCalendarTime(task.updatedAt),
                            }]

                } // alternatively, use the `events` setting to fetch from a feed
                // select={handleDateSelect}
                eventContent={renderEventContent} // custom render function
                eventClick={(info) => {
                    if (user.role === "backofficer")
                        dispatch(getTaskById(info.event._def.extendedProps.taskId))
                            .then((res: any) => {
                                if (res.payload.status === "success") {
                                    mainRef.current.scrollIntoView({ behavior: 'smooth' })
                                }
                            })
                    else {
                        mainRef.current.scrollIntoView({ behavior: 'smooth' })
                    }
                }}
                eventMouseEnter={(info) => {
                    // add cursor pointer
                    info.el.style.cursor = 'pointer';
                    // info.el.style.backgroundColor = 'lightblue';
                }}
                // eventMouseLeave={(info) => {
                //     // back to normal 
                //     info.el.style.backgroundColor = '#3788d8';
                // }}
                eventClassNames={event => {
                    if (event.event._def.extendedProps.state === "done")
                        return "bg-blue-400 border-blue-400 hover:bg-blue-500 hover:border-blue-500"
                    else if (event.event._def.extendedProps.state === "in progress")
                        return "bg-green-400 border-green-400  hover:bg-green-500 hover:border-green-500"
                    else
                        return "bg-yellow-400 border-yellow-400 hover:bg-yellow-500 hover:border-yellow-500"
                }}
            />
            <div
                ref={mainRef} id="overviewPage_show" className="w-full flex flex-col h-fit p-4">
                <span className="text-base font-semibold w-full h-fit p-4">
                    Task information:
                </span>
                {taskLoading ?
                    <div className="w-full h-fit flex justify-center items-center">
                        <Spinner/>  
                    </div>
                    :
                    <>
                        {
                            user.role === "backofficer" && task &&
                            <TaskChild task={task} />
                        }
                        {
                            (user.role === "janitor" || user.role === "collector") && task &&
                            <TaskChild task={task} />
                        }
                        {
                            (user.role === "janitor" || user.role === "collector") && !task &&
                            <div className="w-full h-fit flex flex-col space-y-4">
                                <span className="text-base font-semibold w-full h-fit p-4">
                                    You don't have any task yet!
                                </span>
                                <span className="text-base font-semibold w-full h-fit p-4">
                                    Please contact your manager to assign you a task!
                                </span>
                            </div>
                        }
                    </>
                }
            </div>
        </motion.div>
    </>);
}

export default memo(OverviewPage);