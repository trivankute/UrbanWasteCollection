import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { memo } from 'react'
import { useNavigate } from 'react-router-dom';
import { pageMotionTime } from '../../configs';
import { motion } from 'framer-motion';
import ListFilter from '../../Components/ListFilter/ListFilter';
import VehicleChildList from '../../Components/VehicleChildList/VehicleChildList';
import Graph from '../../Components/Graph/Graph';

function TaskAddPage() {
    const navigate = useNavigate();
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
            <span className="font-semibold text-base">Select Available Vehicle:</span>
            <div className="w-full h-fit flex items-center space-x-2">
                <span className="font-semibold text-base">Type:</span>
                <ListFilter ListArrayText={["type", "janitor", "collector"]} />
            </div>
            <VehicleChildList />
            <span className="font-semibold text-base">Select Disposal and MCPs:</span>
            <div className="w-full h-fit flex justify-center items-center">
                <Graph />
            </div>
            <span className="font-semibold text-base">Disposal: A</span>
            <span className="font-semibold text-base">MCPs Before: </span>
            <span className="font-semibold text-base ml-4">+ MCPid: 2 Đại học Bách Khoa, capacity: 90%</span>
            <span className="font-semibold text-base">Thời gian bắt đầu: 6pm 26/2/2023</span>
            <div className="mx-auto w-20 min-w-20 h-fit p-2 rounded-lg font-semibold text-white bg-green-400 cursor-pointer hover:bg-green-300 flex justify-center items-center">
                Submit
            </div>
        </motion.div>
    </>);
}

export default memo(TaskAddPage);