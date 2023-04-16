import { motion } from "framer-motion";
import { pageMotionTime } from "../../configs";
function PageNotFound() {
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
            <div className="w-full h-full flex justify-center items-center">
                <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
            </div>
        </motion.div>
    </>);
}

export default PageNotFound;