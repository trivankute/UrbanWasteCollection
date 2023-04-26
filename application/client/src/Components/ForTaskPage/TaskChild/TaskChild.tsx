import clsx from 'clsx';
import { memo } from 'react'
import TaskModalSlice from '../../../redux/slices/Modals/TaskModalslice';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import formatTime from '../../../utils/formatTime';
function TaskChild({ task }: { task:any}) {
    const location = useLocation()
    const dispatch = useDispatch<any>()
    return (<>
        <div onClick={() => {
            if (location.pathname.includes("/tasks") || location.pathname.includes("/overview"))
            {
                dispatch(TaskModalSlice.actions.handleOpen({data:task}))
            }
        }} className="text-ant sm:text-base cursor-pointer hover:bg-gray-200 w-full h-fit p-2 rounded-xl bg-[#F5F5F5] flex justify-around items-center">
            <span className="font-semibold capitalize  max-w-[40]">TaskName: {task.name}</span>
            <span className=" font-semibold capitalize">Type: <span className=" font-normal">{task.type}</span></span>
            <span className=" font-semibold">Started: <span className=" font-normal"> {formatTime(task.createdAt)}</span></span>
            {
                task.state === "need review" ?
                    <span className=" font-semibold">Trigger: <span className=" font-normal"> {formatTime(task.updatedAt)}</span></span>
                    :
                    task.state === "done" ?
                        <span className=" font-semibold">End: <span className=" font-normal"> {formatTime(task.doneAt)}</span></span>
                        :
                        <></>
            }
            <div className={clsx("ml-2 p-2 min-w-20 h-fit rounded-xl text-white  font-semibold capitailize flex justify-center items-center", {
                "bg-green-400": task.state === "in progress",
                "bg-yellow-400": task.state === "need review",
                "bg-blue-400": task.state === "done"
            })}>{
                    task.state === "in progress" ? "in progress" : task.state === "need review" ? "Need review" : "Done"
                }</div>
        </div>
    </>);
}

export default memo(TaskChild);