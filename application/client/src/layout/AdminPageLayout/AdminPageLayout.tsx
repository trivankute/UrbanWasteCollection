import { memo } from "react";
import { Outlet, useLocation } from 'react-router-dom'
import SidebarAdmin from "../../Components/Sidebar/SidebarAdmin/SidebarAdmin";
import MenuResponsiveBar from "../../Components/MenuResponsiveBar/MenuResponsiveBar";
import WorkerModal from "../../Components/ForWorkerPage/WorkerModal/WorkerModal";
import VehicleAddModal from "../../Components/ForVehiclePage/VehicleAddModal/VehicleAddModal";
import VehicleModal from "../../Components/ForVehiclePage/VehicleModal/VehicleModal";
import TaskModal from "../../Components/ForTaskPage/TaskModal/TaskModal";

function AdminPageLayout() {
    const location = useLocation()
    return (<>
        <div className="bg-[#D2E7D6] min-h-screen w-full h-full flex">
            <SidebarAdmin />
            <div className="w-full h-full p-8">
                <Outlet />
            </div>
            {
                location.pathname.includes("workers") && 
                <WorkerModal />
            }
            {
                location.pathname.includes("vehicles") && 
                <>
                <VehicleAddModal />
                <VehicleModal />
                </>
            }
            {
                (location.pathname.includes("tasks")||location.pathname.includes("overview")) &&
                <TaskModal/>
            }
        </div>
        <MenuResponsiveBar/>
    </>);
}

export default memo(AdminPageLayout);