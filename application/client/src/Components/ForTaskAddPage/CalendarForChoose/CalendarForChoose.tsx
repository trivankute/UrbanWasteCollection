import { formatDate } from '@fullcalendar/core';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { memo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ResponsiveStore, TasksStore } from '../../../redux/selectors';
import { searchTasks } from '../../../redux/slices/TasksSlice';
import SmallNotification from '../../../redux/slices/Modals/SmallNotificationSlice';
import moment from 'moment';
const currentDate = moment().startOf('day');

function CalendarForChoose({ time, setTime, taskName }: { time: any, setTime: any, taskName: any }) {
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
                <div className="d-flex justify-content-center flex-column text-ant">
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
    const handleDateSelect = (selectInfo: any) => {
        let calendarApi = selectInfo.view.calendar
        if (taskName) {
            calendarApi.addEvent({
                title: taskName,
                start: selectInfo.startStr,
                end: selectInfo.endStr,
            })
            const date = new Date(selectInfo.startStr);
            // const isoDate = date.toISOString();
            const offset = new Date().getTimezoneOffset();
            const adjustedDate = new Date(date.getTime() - (offset * 60 * 1000));
            const adjustedIsoDate = adjustedDate.toISOString();
            setTime(adjustedIsoDate);
        }
        else {
            dispatch(SmallNotification.actions.handleOpen({ type: "error", content: "Please fill out the task name" }))
        }
    }

    const isResponsive = useSelector(ResponsiveStore).data
    const tasks = useSelector(TasksStore).tasks
    const dispatch = useDispatch<any>()
    useEffect(() => {
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
    }, [])
    return (<>
        <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView={"timeGridWeek"}
            headerToolbar={{
                start: "timeGridWeek,dayGridMonth", // will normally be on the left. if RTL, will be on the right
                center: 'title',
                end: 'prev,next' // will normally be on the right. if RTL, will be on the left
            }}
            editable={false}
            selectable={time?false:true}
            selectMirror={true}
            dayMaxEvents={true}
            contentHeight={isResponsive ? "300px" : "auto"} // 
            weekends={true}
            themeSystem="bootstrap"
            events={tasks &&
                tasks.map((item: any, index: number) => {
                    if (item.state !== "done")
                        return {
                            title: item.name,
                            type: item.type,
                            state: item.state,
                            start: fromTaskTimeToCalendarTime(item.createdAt),
                        }
                    else {
                        return {
                            title: item.name,
                            type: item.type,
                            state: item.state,
                            start: fromTaskTimeToCalendarTime(item.createdAt),
                            end: fromTaskTimeToCalendarTime(item.updatedAt),
                        }
                    }
                })} // alternatively, use the `events` setting to fetch from a feed
            select={handleDateSelect}
            eventContent={renderEventContent} // custom render function
            validRange={{
                start: currentDate.toISOString(), // exclude dates before current date
            }}
            // eventClick={(info) => {
            //     info.el.style.backgroundColor = 'red';
            //     mainRef.current.scrollIntoView({ behavior: 'smooth' })
            // }}
            eventMouseEnter={(info) => {
                // add cursor pointer
                info.el.style.cursor = 'pointer';
                info.el.style.backgroundColor = 'lightblue';
            }}
            eventMouseLeave={(info) => {
                info.el.style.backgroundColor = '#3788d8';
            }}
        />
    </>);
}

export default memo(CalendarForChoose);