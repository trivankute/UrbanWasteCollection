import { memo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { UserStore } from "../redux/selectors";
import { getMe } from "../redux/slices/UserSlice";
import Spinner from "../Components/Spinner/Spinner";
import { Outlet } from 'react-router-dom'

function CheckMe() {
    const dispatch = useDispatch<any>();
    const user = useSelector(UserStore)
    const navigate = useNavigate()
    useEffect(() => {
        if (localStorage.getItem("token"))
            dispatch(getMe())
                .then((res: any) => {
                    if (res.payload.status === "success") {
                    }
                    else {
                        localStorage.removeItem("token")
                        navigate('/')
                    }
                })
    }, [])
    return (<>
        {
            localStorage.getItem("token") ?
                <>
                    {
                        user.data ?
                            <Outlet />
                            :
                            <div className="w-full h-[600px] flex justify-center items-center">
                                <Spinner />
                            </div>
                    }
                </>
                :
                <>
                    <Outlet />
                </>
        }
    </>);
}

export default memo(CheckMe);