import { memo } from "react";
import Graph from "../../Components/ForHomePage/Graph/Graph";
import MCPSchedule from "../../Components/ForHomePage/MCPSchedule/MCPSchedule";
import { pageMotionTime } from "../../configs";
import { motion } from "framer-motion";

function Home() {
  return (
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
      }}
      className="w-full flex flex-col justify-center p-8 space-y-12">
      <h1 className="text-center text-3xl lg:text-6xl text-white font-semibold">Urban Waste Collection
        UWC 2.0</h1>
      <div className="w-full flex flex-col lg:flex-row justify-between items-center px-32 gap-y-4">
        <Graph/>
        <MCPSchedule/>
      </div>
    </motion.div>
  );
}

export default memo(Home);