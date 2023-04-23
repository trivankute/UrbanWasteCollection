import { memo } from 'react'
import SidebarWorker from '../../Components/Sidebar/SidebarWorker/SidebarWorker';
import { Outlet, useLocation } from 'react-router-dom';
import MenuResponsiveBar from '../../Components/MenuResponsiveBar/MenuResponsiveBar';
import { AnimatePresence } from 'framer-motion';
import { TaskModalStore, VehicleModalStore } from '../../redux/selectors';
import { useSelector } from 'react-redux';
import TaskModal from '../../Components/ForTaskPage/TaskModal/TaskModal';
import VehicleModal from '../../Components/ForVehiclePage/VehicleModal/VehicleModal';

function WorkerPageLayout() {
    const location = useLocation()
    const vehicleModalIsShow = useSelector(VehicleModalStore).data
    // const workerModalIsShow = useSelector(WorkerModalStore).data
    // const vehicleAddModalIsShow = useSelector(VehicleAddModalStore).data
    const taskModalIsShow = useSelector(TaskModalStore).show
    return (<>
        <div className="bg-[#D2E7D6] min-h-screen w-full h-full flex">
            <SidebarWorker />
            <div className="w-full h-full p-8">
                <Outlet />
            </div>
            {/* {
                location.pathname.includes("workers") &&
                <AnimatePresence mode="wait">
                    {
                        workerModalIsShow &&
                        <WorkerModal />
                    }
                </AnimatePresence>
            } */}
            {
                location.pathname.includes("worker/overview") &&
                <>
                    <AnimatePresence mode="wait">
                        {
                            vehicleModalIsShow &&
                            <VehicleModal />
                        }
                    </AnimatePresence>
                </>
            }
            {
                (location.pathname.includes("tasks") || location.pathname.includes("overview")) &&
                <AnimatePresence mode="wait">
                    {
                        taskModalIsShow &&
                        <TaskModal />
                    }
                </AnimatePresence>
            }
        </div>
        <MenuResponsiveBar />
    </>);
}

export default memo(WorkerPageLayout);