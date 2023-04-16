import { memo } from 'react'
import PageHeaderSearchAdd from '../../Components/PageHeaderSearchAdd/PageHeaderSearchAdd';
import { pageMotionTime } from '../../configs';
import { motion } from "framer-motion";
import ListFilter from '../../Components/ListFilter/ListFilter';
import TaskChild from '../../Components/ForTaskPage/TaskChild/TaskChild';

function TasksPage() {
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
            className="h-full"
        >
            <PageHeaderSearchAdd type="tasks" />
            <div className="w-full flex py-2 gap-x-4 mb-4">
                <ListFilter ListArrayText={["type task", "janitor", "collector"]}/>
                <ListFilter ListArrayText={["type state","in progress", "need review", "done"]}/>
            </div>
            <div className="space-y-4 max-h-screen overflow-y-auto">
                <TaskChild type="in progress"/>
                <TaskChild type="need review"/>
                <TaskChild type="done"/>
            </div>
        </motion.div>
    </>);
}

export default memo(TasksPage);