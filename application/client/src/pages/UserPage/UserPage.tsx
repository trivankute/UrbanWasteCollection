import { memo } from "react";
import UserGeneralCard from "../../Components/ForUserPage/UserGeneralCard/UserGeneralCard";
import { pageMotionTime } from "../../configs";
import { motion } from "framer-motion";
import UserDetailCard from "../../Components/ForUserPage/UserDetailCard/UserDetailCard";

function UserPage() {
    return ( <>
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
                <UserGeneralCard/>
                <UserDetailCard/>
            </motion.div>
    </> );
}

export default memo(UserPage);