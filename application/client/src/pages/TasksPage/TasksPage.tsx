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
import Pagination from '../../Components/Pagination/Pagination';

function TasksPage() {
    const [type, setType] = useState("")
    const [state, setState] = useState("")
    const [name, setName] = useState("")
    const dispatch = useDispatch<any>()
    const tasks = useSelector(TasksStore).tasks
    const tasksLoading = useSelector(TasksStore).loading
    const tasksTotal = useSelector(TasksStore).total
    const [currPage, setCurrPage] = useState(1)
    const pageSize = 8
    useEffect(() => {
        handleSearch()
    }, [currPage])
    function handleSearch() {
        dispatch(searchTasks(
            {
                "page": currPage,
                "pageSize": pageSize,
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
            <PageHeaderSearchAdd setCurrPage={setCurrPage} type="tasks" state={name} setState={setName} handleSearch={handleSearch} />
            <div className="w-full flex py-2 gap-x-4 mb-4">
                <ListFilter setCurrPage={setCurrPage} setState={setType} ListArrayText={["type task", "janitor", "collector"]} />
                <ListFilter setCurrPage={setCurrPage} setState={setState} ListArrayText={["type state", "in progress", "need review", "done"]} />
            </div>
            <div className="space-y-4 max-h-screen overflow-y-auto">
                {
                    tasksLoading ?
                        <div className="w-full h-[300px] flex justify-center items-center">
                            <Spinner />
                        </div>
                        :
                        tasks && tasks.length > 0 ?
                            <>
                                <div className="w-full h-fit font-semibold text-ant sm:text-base">Result: {tasks.length}</div>
                                {tasks.map((task: any, index: number) => {
                                    return <TaskChild key={index} task={task} />
                                })}
                            </>
                            :
                            <>
                                None
                            </>
                }
            </div>
            {
                <div className="w-full h-fit mt-2 flex justify-end">
                    <Pagination currPage={currPage} setCurrPage={setCurrPage} totalPage={Math.ceil(tasksTotal/pageSize)}/>
                </div>
            }
        </motion.div>
    </>);
}

export default memo(TasksPage);