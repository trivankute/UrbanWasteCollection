import { memo, useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { UserStore } from "../redux/selectors";
import Spinner from "../Components/Spinner/Spinner";

function WorkerOnly() {
    const user = useSelector(UserStore)
    const navigate = useNavigate()
    useEffect(()=>{
        if(user.data && (user.data.role !== "janitor"&&user.data.role !== "collector"))
        {
            navigate("/notification", {
                state: {
                    type: "error",
                    message: "You are not allowed to access this page",
                    link: "/"
                }
            })
        }
    },[])
    return (<>
        {
            (user.data && (user.data.role === "janitor"||user.data.role === "collector")) ?
                <Outlet />
                :
                <div className="w-full h-[600px] flex justify-center items-center">
                    <Spinner />
                </div>
        }
    </>);
}

export default memo(WorkerOnly);