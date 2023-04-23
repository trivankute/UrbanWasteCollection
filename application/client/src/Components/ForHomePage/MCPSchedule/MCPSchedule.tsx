import {memo} from 'react'
import MCPChild from './MCPChild'
import { TasksStore, UserStore } from '../../../redux/selectors';
import { useSelector } from 'react-redux';
import formatTime from '../../../utils/formatTime';
import { useNavigate } from 'react-router-dom';
function MCPSchedule() {
    const tasks = useSelector(TasksStore).tasks
    const user = useSelector(UserStore).data
    const navigate = useNavigate()
    return ( <>
        <div className="w-60 flex flex-col min-h-20 rounded-xl overflow-hidden drop-shadow-lg">
            <div className="border-b p-2 border-black font-bold text-center bg-[#a5f2a5]">MCPs-Schedule:</div>
            <div className="flex flex-col">
                <MCPChild content= "Click on a vehicle to see the task"/>
                {
                    tasks&&tasks.map((task:any, index:number)=>{
                        return <MCPChild key={index} content= {`Task ${task.name}: Start at ${formatTime(task.createdAt)}`} taskId={task.id} vehicleId={task.vehicle.id}/>
                    })
                }
                {
                    !user &&
                    <MCPChild onClick={()=>{
                        navigate('/signin')
                    }} content= "Log in to see in detail and review our service"/>
                }
            </div>
        </div>
    </> );
}

export default memo(MCPSchedule);