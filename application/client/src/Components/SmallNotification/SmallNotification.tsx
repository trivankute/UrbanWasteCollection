import { memo } from "react";
import { motion } from "framer-motion";
import { SmallNotificationStore } from "../../redux/selectors";
import { useDispatch, useSelector } from "react-redux";
import SmallNotificationSlice from "../../redux/slices/Modals/SmallNotificationSlice";
import clsx from "clsx";

function SmallNotification() {
    const error = useSelector(SmallNotificationStore)
    const dispatch = useDispatch<any>()
    return ( <motion.div
        initial={{
            opacity: 0,
            x: "-100px"
        }}
        animate={{
            opacity: 1,
            x: "10px"
        }}
        exit={{
            opacity: 0,
            x: "-100px"
        }}
        onClick={()=>{
            dispatch(SmallNotificationSlice.actions.handleClose({}))
        }}
        className={clsx("w-fit h-fit cursor-pointer hover:bg-gray-100 bg-white rounded-xl shadow-md fixed top-[70px] text-sm left-0 z-50 p-4", {
            "text-green-500":error.type==="success",
            "text-red-500":error.type==="error"
        })}
        >
            {error.content}
    </motion.div> );
}

export default memo(SmallNotification);