import { memo } from "react";
import { Outlet, useLocation } from 'react-router-dom'
import SidebarAdmin from "../../Components/Sidebar/SidebarAdmin/SidebarAdmin";
import MenuResponsiveBar from "../../Components/MenuResponsiveBar/MenuResponsiveBar";
import WorkerModal from "../../Components/ForWorkerPage/WorkerModal/WorkerModal";
import VehicleAddModal from "../../Components/ForVehiclePage/VehicleAddModal/VehicleAddModal";
import VehicleModal from "../../Components/ForVehiclePage/VehicleModal/VehicleModal";
import TaskModal from "../../Components/ForTaskPage/TaskModal/TaskModal";
import { AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { TaskModalStore, VehicleAddModalStore, VehicleModalStore, WorkerModalStore } from "../../redux/selectors";

function AdminPageLayout() {
    const location = useLocation()
    const vehicleModalIsShow = useSelector(VehicleModalStore).data
    const workerModalIsShow = useSelector(WorkerModalStore).data
    const vehicleAddModalIsShow = useSelector(VehicleAddModalStore).data
    const taskModalIsShow = useSelector(TaskModalStore).show
    return (<>
        <div className="bg-[#D2E7D6] min-h-screen w-full h-full flex">
            <SidebarAdmin />
            <div className="w-full h-full p-8">
                <Outlet />
            </div>
            {
                location.pathname.includes("workers") &&
                <AnimatePresence mode="wait">
                    {
                        workerModalIsShow &&
                        <WorkerModal />
                    }
                </AnimatePresence>
            }
            {
                location.pathname.includes("vehicles") &&
                <>
                    <AnimatePresence mode="wait">
                        {
                            vehicleModalIsShow &&
                            <VehicleModal />
                        }
                        {
                            vehicleAddModalIsShow &&
                            <VehicleAddModal />
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

export default memo(AdminPageLayout);