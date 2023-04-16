import { memo } from "react";
import { motion } from "framer-motion";
import { pageMotionTime } from "../../configs";
import PageHeaderSearchAdd from "../../Components/PageHeaderSearchAdd/PageHeaderSearchAdd";
import ListFilter from "../../Components/ListFilter/ListFilter";
import VehicleChild from "../../Components/ForVehiclePage/VehicleChild/VehicleChild";

function VehiclesPage() {
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
            className="h-full"
        >
            <PageHeaderSearchAdd type="vehicles" />
            <div className="w-full flex py-2 gap-x-4 mb-4">
                <ListFilter ListArrayText={["type worker", "janitor", "collector"]}/>
                <ListFilter ListArrayText={["type state","nothing", "in progress"]}/>
            </div>
            <div className="space-y-4 max-h-screen overflow-y-auto">
                <VehicleChild/>
                <VehicleChild/>
                <VehicleChild/>
                <VehicleChild/>
                <VehicleChild/>
                <VehicleChild/>
            </div>
        </motion.div>
    </> );
}

export default memo(VehiclesPage);