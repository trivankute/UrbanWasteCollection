import { memo } from "react";
import SidebarChild from "../Sidebar/SidebarChild/SidebarChild";
import { useSelector, useDispatch } from "react-redux";
import { MenuStore, UserStore } from "../../redux/selectors";
import clsx from 'clsx'
import MenuSlice from "../../redux/slices/MenuSlice";
import { useNavigate } from "react-router-dom";
import { logout } from "../../redux/slices/UserSlice";
import SmallNotification from "../../redux/slices/Modals/SmallNotificationSlice";
import Spinner from "../Spinner/Spinner";

function MenuResponsiveBar() {
    const headerLg = 64
    const headerSm = 60
    const dispatch = useDispatch<any>()
    const menuResponsive = useSelector(MenuStore)
    const user = useSelector(UserStore)
    const navigate = useNavigate()
    return (<>
        {
            menuResponsive.data &&
            <div onClick={() => {
                dispatch(MenuSlice.actions.toggleHandle({}))
            }} className="block lg:hidden w-full h-full fixed top-[60px] lg:top-[64px] left-0 right-0 bottom-0 bg-gray-400 opacity-50">
            </div>
        }
        <aside className={clsx("block lg:hidden w-64 h-max fixed top-[60px] lg:top-[64px] right-0 transition-transform translate-x-0", {
            "translate-x-full": !menuResponsive.data
        })}>
            <div className="h-screen px-3 py-4 overflow-y-auto bg-white dark:bg-gray-800">
                <div className="w-full h-fit flex justify-between mb-4">
                    {
                        !user.data ?
                            <>
                                <button onClick={() => {
                                    navigate("/signin")
                                    dispatch(MenuSlice.actions.toggleHandle({}))
                                }} className="block lg:hidden text-gray-800 border-2 border-[#52D452] dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800">Log in</button>
                                <button onClick={() => {
                                    navigate("/signup")
                                    dispatch(MenuSlice.actions.toggleHandle({}))
                                }} className="block lg:hidden text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800">Sign Up</button>
                            </>
                            :
                            <>
                                <button onClick={() => {
                                    dispatch(logout())
                                        .then((res: any) => {
                                            if (res.payload.status === "success") {
                                                navigate("/")
                                                dispatch(MenuSlice.actions.toggleHandle({}))
                                                dispatch(SmallNotification.actions.handleOpen({type: "success", content: "Logged out successfully!"}))
                                            }
                                        })

                                }} className="mx-auto block lg:hidden text-gray-800 bg-red-400  dark:text-white hover:bg-red-500 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800">{
                                user.loading?
                                <Spinner/>
                                :
                                "Log out"}</button>
                            </>
                    }
                </div>
                {
                    user.data &&
                    <ul className="space-y-4 font-medium">
                        {
                            user.data.role === "backofficer" ? <>
                                <SidebarChild content="Profile" link="profile" />
                                <SidebarChild content="Overview" link="overview" />
                                <SidebarChild content="Workers" link="workers" />
                                <SidebarChild content="Vehicles" link="vehicles" />
                                <SidebarChild content="Tasks" link="tasks" />
                            </> :
                                (user.data.role === "janitor" || user.data.role === "collector") ?
                                    <>
                                        <SidebarChild content="Profile" link="profile" />
                                        <SidebarChild content="Check" link="check" />
                                        <SidebarChild content="Overview" link="overview" />
                                        {/* <SidebarChild content="Vehicles" link="vehicles" />
                                        <SidebarChild content="Tasks" link="tasks" /> */}
                                    </>
                                    :
                                    <>
                                    </>
                        }
                    </ul>
                }
            </div>
        </aside >
    </>);
}

export default memo(MenuResponsiveBar);