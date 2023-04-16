import { memo, useState, useRef } from 'react'
import { pageMotionTime } from '../../configs';
import { motion } from 'framer-motion';
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { formatDate } from '@fullcalendar/core';
import TaskChild from '../../Components/ForTaskPage/TaskChild/TaskChild';
import { ResponsiveStore } from '../../redux/selectors';
import { useSelector } from 'react-redux';
function OverviewPage() {
    let mainRef = useRef<any>()
    let eventGuid = 0
    let todayStr = new Date().toISOString().replace(/T.*$/, '')
    function createEventId() {
        return String(eventGuid++)
    }
    function handleDateSelect(selectInfo: any) {
        let title = prompt('Please enter a new title for your event')
        let calendarApi = selectInfo.view.calendar

        calendarApi.unselect() // clear date selection

        if (title) {
            calendarApi.addEvent({
                id: createEventId(),
                title,
                start: selectInfo.startStr,
                end: selectInfo.endStr,
                allDay: selectInfo.allDay
            })
        }
    }

    function renderEventContent(eventInfo: any) {
        // RoadId : 120 - Distance : 9km
        const title = eventInfo.event.title
        const taskName = eventInfo.event._def.extendedProps.taskName
        const type = eventInfo.event._def.extendedProps.type

        return (
            <>
                <div className="d-flex justify-content-center flex-column">
                    {/* Start time and end time */}
                    <div><b>Start: {formatDate(eventInfo.event.start, { hour: 'numeric', minute: 'numeric' })}</b></div>
                    {
                        eventInfo.event.end && <div><b>End: {formatDate(eventInfo.event.end, { hour: 'numeric', minute: 'numeric' })}</b></div>
                    }
                    <div className="capitalize">title: {title}</div>
                    <div className="capitalize">task: {taskName}</div>
                    <div className="capitalize">type: {type}</div>
                </div>
            </>
        )
    }

    const isResponsive = useSelector(ResponsiveStore).data
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
            <span className="text-base font-semibold w-full h-fit">
                Click on task to see in detail:
            </span>
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView={"dayGridMonth"}
                headerToolbar={{
                    start: "timeGridWeek,dayGridMonth", // will normally be on the left. if RTL, will be on the right
                    center: 'title',
                    end: 'prev,next' // will normally be on the right. if RTL, will be on the left
                }}
                editable={true}
                selectable={true}
                selectMirror={true}
                dayMaxEvents={true}
                contentHeight={isResponsive?"300px":"auto"} // 
                weekends={true}
                themeSystem="bootstrap"
                events={[
                    {
                        title: 'Event 1',
                        type: 'janitor',
                        taskName: "don dep TBC",
                        taskId: "123",
                        start: '2023-04-15T09:00:00',
                    },
                    {
                        title: 'Event 2',
                        type: 'janitor',
                        taskName: "don dep TBC",
                        taskId: "123",
                        start: '2023-04-14T09:00:00',
                        end: '2023-04-14T12:00:00',
                    }]} // alternatively, use the `events` setting to fetch from a feed
                // select={handleDateSelect}
                eventContent={renderEventContent} // custom render function
                // eventClick={(info) => {
                //     info.el.style.backgroundColor = 'red';
                //     mainRef.current.scrollIntoView({ behavior: 'smooth' })
                // }}
            // eventMouseEnter={(info) => {
            //     info.el.style.backgroundColor = 'lightblue';
            // }}
            />
            <div
                ref={mainRef} id="overviewPage_show" className="w-full flex flex-col h-fit p-4">
                <span className="text-base font-semibold w-full h-fit p-4">
                    Task information:
                </span>
                <TaskChild type="in progress" />
            </div>
        </motion.div>
    </>);
}

export default memo(OverviewPage);