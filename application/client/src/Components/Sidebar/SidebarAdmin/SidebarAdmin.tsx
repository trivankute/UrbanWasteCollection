import { memo } from 'react'
import SidebarChild from '../SidebarChild/SidebarChild';

function SidebarAdmin() {
    return (<>
        <div className="w-64 min-h-screen hidden lg:block">
            <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
                <ul className="space-y-4 font-medium">
                    <SidebarChild content="Profile" link="profile" />
                    <SidebarChild content="Overview" link="overview" />
                    <SidebarChild content="Workers" link="workers" />
                    <SidebarChild content="Vehicles" link="vehicles" />
                    <SidebarChild content="Tasks" link="tasks" />
                </ul>
            </div>
        </div>
    </>);
}

export default memo(SidebarAdmin);