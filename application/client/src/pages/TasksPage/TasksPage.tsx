import { memo, useEffect, useState } from 'react'
import PageHeaderSearchAdd from '../../Components/PageHeaderSearchAdd/PageHeaderSearchAdd';
import { pageMotionTime } from '../../configs';
import { motion } from "framer-motion";
import ListFilter from '../../Components/ListFilter/ListFilter';
import TaskChild from '../../Components/ForTaskPage/TaskChild/TaskChild';
import { useDispatch, useSelector } from 'react-redux';
import { TasksStore } from '../../redux/selectors';
import { searchTasks } from '../../redux/slices/TasksSlice';
import Spinner from '../../Components/Spinner/Spinner';

function TasksPage() {
    const [type, setType] = useState("")
    const [state, setState] = useState("")
    const [name, setName] = useState("")
    const dispatch = useDispatch<any>()
    const tasks = useSelector(TasksStore).tasks
    const tasksLoading = useSelector(TasksStore).loading
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
    function handleSearch() {
        dispatch(searchTasks(
            {
                "page": 1,
                "pageSize": 20,
                "name": name,
                "type": type,
                "state": state,
                "disposalName": "",
                "mcpName": ""
            }))
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
            className="h-full"
        >
            <PageHeaderSearchAdd type="tasks" state={name} setState={setName} handleSearch={handleSearch} />
            <div className="w-full flex py-2 gap-x-4 mb-4">
                <ListFilter setState={setType} ListArrayText={["type task", "janitor", "collector"]} />
                <ListFilter setState={setState} ListArrayText={["type state", "in progress", "need review", "done"]} />
            </div>
            <div className="space-y-4 max-h-screen overflow-y-auto">
                {
                    tasksLoading ?
                        <div className="w-full h-[300px] flex justify-center items-center">
                            <Spinner />
                        </div>
                        :
                        tasks && tasks.map((task: any, index: number) => {
                            return <TaskChild key={index} task={task} />
                        })
                }
            </div>
        </motion.div>
    </>);
}

export default memo(TasksPage);