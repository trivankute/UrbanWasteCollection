import { memo } from 'react'
import { motion } from "framer-motion";
import { pageMotionTime } from '../../configs';
import { useDispatch, useSelector } from 'react-redux';
import { UserStore } from '../../redux/selectors';
import { workerCheckin, workerCheckout } from '../../redux/slices/UserSlice';
import SmallNotification from '../../redux/slices/Modals/SmallNotificationSlice';
import clsx from 'clsx';
import Spinner from '../../Components/Spinner/Spinner';

function CheckPage() {
    const user = useSelector(UserStore).data
    const userLoading = useSelector(UserStore).loading
    const dispatch = useDispatch<any>()
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
            className="flex flex-col items-center md:flex-row  md:justify-center gap-12"
        >
            <div className="w-full flex flex-col items-center space-y-4">
                <div className="w-full h-fit sm:h-32 bg-white shadow-md rounded-xl flex items-center p-4">
                    <span className={clsx("text-sm sm:text-base font-semibold", {
                        "text-green-500": user.checkin,
                    })}>You are not check in, click the button below to checkin!</span>
                </div>
                {
                    user.checkin &&
                    <div className="w-full h-fit sm:h-32 bg-white shadow-md rounded-xl flex items-center p-4">
                        <span className={clsx("text-sm sm:text-base font-semibold", {
                            "text-green-500": user.checkout,
                        })}>You are not check out, click the button below to checkout!</span>
                    </div>
                }
                <div className="w-full h-fit space-x-4">
                    <button onClick={() => {
                        if (!user.checkin && !user.checkout)
                            dispatch(workerCheckin())
                                .then((res: any) => {
                                    if (res.payload.status === "success")
                                        dispatch(SmallNotification.actions.handleOpen({ type: "success", content: "You have checked in" }))
                                    else
                                        dispatch(SmallNotification.actions.handleOpen({ type: "error", content: res.payload.message }))
                                })
                        else
                            dispatch(SmallNotification.actions.handleOpen({ type: "error", content: "You have already checked in or checked out" }))
                    }} className="w-32 h-fit p-2 sm:p-4 rounded-xl text-white bg-blue-400 hover:bg-blue-500 cursor-pointer shadow-md">{
                        userLoading ?
                            <Spinner />
                            :
                    "Check in"}</button>
                    {
                        user.checkin && <>
                            <button onClick={() => {
                                if(!user.checkout)
                                dispatch(workerCheckout())
                                .then((res: any) => {
                                    if (res.payload.status === "success")
                                        dispatch(SmallNotification.actions.handleOpen({ type: "success", content: "You have checked out" }))
                                    else
                                        dispatch(SmallNotification.actions.handleOpen({ type: "error", content: res.payload.message }))
                                })
                                else
                                dispatch(SmallNotification.actions.handleOpen({ type: "error", content: "You have already checked out" }))
                                
                            }} className="w-32 h-fit p-4 rounded-xl text-white bg-blue-400 hover:bg-blue-500 cursor-pointer shadow-md">{
                                userLoading?
                                <Spinner/>
                                :
                            "Check out"}</button>
                        </>
                    }
                </div>
            </div>
        </motion.div >
    </>);
}

export default memo(CheckPage);