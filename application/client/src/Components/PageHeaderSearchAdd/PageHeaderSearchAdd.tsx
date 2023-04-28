import { memo } from "react";
import VehicleAddModalSlice from "../../redux/slices/Modals/VehicleAddModalSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

function PageHeaderSearchAdd({ type, setState=null, state=null, handleSearch=null, setCurrPage }: { type: "workers" | "vehicles" | "tasks", setState?:any, state?:any, handleSearch?:any, setCurrPage?:any }) {
    const navigate = useNavigate();
    const dispatch = useDispatch<any>()
    return (<>
        <div className="w-full flex gap-x-4 items-center">
            <div className="mb-4 w-full h-fit rounded-2xl overflow-hidden flex flex-col md:flex-row items-center px-2 sm:px-8 py-2 sm:py-4 bg-white shadow-md justify-around">
                <div className="h-fit flex justify-center items-center min-w-[150px]">
                    {
                        type === "workers" ?
                            <span className="font-bold text-ant sm:text-sm mr-2 ">Danh sách workers</span>
                            :
                            type === "vehicles" ?
                                <span className="font-bold text-ant sm:text-sm mr-2">Danh sách vehicles</span>
                                :
                                type === "tasks" ?
                                    <span className="font-bold text-ant sm:text-sm mr-2">Danh sách tasks</span>
                                    :
                                    <></>
                    }
                </div>
                <div className="w-full">
                    <label htmlFor="default-search" className="mb-2 text-ant sm:text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                    <div className="flex items-center w-full">
                        <label htmlFor="simple-search" className="sr-only">Search</label>
                        <div className="relative w-full">
                            <div className="absolute w-full inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg aria-hidden="true" className="w-4 sm:w-5 h-4 sm:h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path></svg>
                            </div>
                            <input onChange={(e)=>{
                                if(setState)
                                setState(e.target.value)
                            }} value={state} type="text" id="simple-search" className="bg-gray-50 border border-gray-300 text-gray-900 text-ant sm:text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-1 pl-10 sm:p-2.5 sm:pl-10  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search" required />
                        </div>
                        <button onClick={()=>{
                            if(handleSearch)
                            handleSearch()
                            if(setCurrPage)
                            setCurrPage(1)
                        }} className="p-1 sm:p-2.5 ml-2 text-ant sm:text-sm font-medium text-white bg-green-400 rounded-lg border border-green-400 hover:bg-green-500 focus:ring-4 focus:outline-none focus:ring-green-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                            <span className="sr-only">Search</span>
                        </button>
                    </div>
                </div>
            </div>
            <button onClick={()=>{
                if(type==="vehicles")
                {
                    dispatch(VehicleAddModalSlice.actions.handleOpen({}))
                }
                if(type==="tasks")
                {
                    navigate("/admin/tasks/add")
                }
            }} className="w-40 h-fit p-2 text-ant sm:text-sm font-semibold rounded-xl text-white bg-green-400 hover:bg-green-300 flex items-center justify-center">
                {
                    type === "workers" ?
                        <span className="font-bold text-ant sm:text-sm  ">+ Add worker</span>
                        :
                        type === "vehicles" ?
                            <span className="font-bold text-ant sm:text-sm ">+ Add vehicle</span>
                            :
                            type === "tasks" ?
                                <span className="font-bold text-ant sm:text-sm ">+ Add task</span>
                                :
                                <></>
                }
            </button>
        </div>
    </>);
}

export default memo(PageHeaderSearchAdd);