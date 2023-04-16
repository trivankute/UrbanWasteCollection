import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { memo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { pageMotionTime } from "../../configs";
import { motion } from "framer-motion";
import clsx from "clsx";

function Notification() {
    const { state: {
        type, message, link
    } } = useLocation()
    const navigate=useNavigate()
    return (<>
        <motion.div
            initial={{
                opacity: 0,
                y: "100%"
            }}
            animate={{
                opacity: 1,
                y: 0
            }}
            exit={{
                opacity: 0,
                y: "100%"
            }}
            transition={{
                duration: pageMotionTime
            }} className="w-[100%] max-w-[300px] rounded-2xl h-fit bg-white p-4 shadow-md flex flex-col space-y-4 items-center">
            <div className={clsx("w-12 h-12 rounded-full flex justify-center items-center",{
                "bg-red-400": type !== "success",
                "bg-green-400": type === "success",
            })}>
                <FontAwesomeIcon icon={faBell as IconProp} className='w-6 h-6 text-white' />
            </div>
            <span className={clsx("text-sm font-semibold capitalize", {
                "text-red-400": type !== "success",
                "text-green-400": type === "success",
            })}>{type}</span>
            <span className={clsx("text-sm font-semibold capitalize", {
                "text-red-400": type !== "success",
                "text-green-400": type === "success",
            })}>{message}</span>
            <button onClick={()=>{
                navigate(link)
            }} className={clsx("w-20 h-fit p-2 rounded-xl text-white font-semibold", {
                "bg-red-400 hover:bg-red-300": type !== "success",
                "bg-green-400 hover:bg-green-300": type === "success",
            })}>OK</button>
        </motion.div>
    </>);
}

export default memo(Notification);