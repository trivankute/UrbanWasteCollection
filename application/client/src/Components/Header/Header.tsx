import { memo } from "react";
import xerac from "../../assets/vehicles/xerac.jpg";
import { useDispatch, useSelector } from 'react-redux'
import MenuSlice from "../../redux/slices/MenuSlice";
import { useNavigate } from "react-router-dom";
import { UserStore } from "../../redux/selectors";
import { logout } from "../../redux/slices/UserSlice";
import Spinner from "../Spinner/Spinner";

function Header() {
    const dispatch = useDispatch<any>()
    const navigate = useNavigate()
    const user = useSelector(UserStore)
    return (<>
        <header className="light">
            <nav className="bg-white shadow-md z-20 border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800 fixed top-0 left-0 right-0">
                <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
                    <div onClick={() => {
                        navigate('/')
                    }} className="cursor-pointer flex items-center">
                        <img src={xerac} className="shadow-md rounded-full mr-3 h-6 sm:h-9" alt="Xe rac Logo" />
                        <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">UWC2.0</span>
                    </div>
                    <div className="flex items-center lg:order-2">
                        {
                            user.data ?
                                <>
                                    <img onClick={() => {
                                        if (user.data.role === "backofficer")
                                            navigate('/admin/profile')
                                        else
                                            navigate('/user/profile')
                                    }}
                                        src={user.data.image} className="cursor-pointer hover:bg-gray-100 w-10 h-10 rounded-full shadow-md mr-3" alt="User Avatar" />
                                    <button onClick={() => {
                                        if(user.data.role === "backofficer")
                                            navigate("/admin/profile")
                                        else if(user.data.role === "janitor"||user.data.role === "collector")
                                            navigate("/worker/profile")
                                    }} className="hidden lg:block bg-blue-300 border-2 text-white hover:bg-blue-400 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800">
                                        {
                                            user.data.loading ?
                                                <Spinner />
                                                :
                                                "Menu"
                                        }
                                    </button>
                                    <button onClick={() => {
                                        dispatch(logout())
                                            .then((res: any) => {
                                                if (res.payload.status === "success") {
                                                    navigate('/notification', {
                                                        state: {
                                                            type: "success",
                                                            message: "Logged out successfully",
                                                            link: "/"
                                                        }
                                                    })
                                                }

                                            })
                                    }} className="hidden lg:block bg-red-300 border-2 text-white hover:bg-red-400 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800">
                                        {
                                            user.data.loading ?
                                                <Spinner />
                                                :
                                                "Log out"
                                        }
                                    </button>
                                </>
                                :
                                <>
                                    <button onClick={() => {
                                        navigate('/signin')
                                    }} className="hidden lg:block text-gray-800 border-2 border-[#52D452] dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800">Log in</button>
                                    <button onClick={() => {
                                        navigate('/signup')
                                    }} className="hidden lg:block text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800">Sign Up</button>
                                </>
                        }
                        <button onClick={() => {
                            dispatch(MenuSlice.actions.toggleHandle({}))
                        }} data-collapse-toggle="mobile-menu-2" type="button" className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="mobile-menu-2" aria-expanded="false">
                            <span className="sr-only">Open main menu</span>
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path></svg>
                            <svg className="hidden w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                        </button>
                    </div>
                    <div className="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1" id="mobile-menu-2">
                        <ul className="flex hover:bg-gray-50 p-2 rounded-xl flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
                            <li>
                                <span onClick={() => {
                                    navigate('/')
                                }} className="cursor-pointer block py-2 pr-4 pl-3 text-black rounded bg-primary-700 lg:bg-transparent lg:text-primary-700 lg:p-0 dark:text-white" aria-current="page">Home</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    </>);
}

export default memo(Header);