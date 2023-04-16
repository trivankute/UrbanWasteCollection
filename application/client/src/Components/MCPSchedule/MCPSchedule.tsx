import {memo} from 'react'
import MCPChild from './MCPChild'
function MCPSchedule() {
    return ( <>
        <div className="w-60 flex flex-col min-h-20 rounded-xl overflow-hidden drop-shadow-lg">
            <div className="border-b p-2 border-black font-bold text-center bg-[#a5f2a5]">MCPs-Schedule:</div>
            <div className="flex flex-col">
                <MCPChild content= "MCP A: 9pm 26/2/2023"/>
                <MCPChild content= "MCP A: 9pm 26/2/2023"/>
                <MCPChild content= "MCP A: 9pm 26/2/2023"/>
                <MCPChild content= "MCP A: 9pm 26/2/2023"/>
                <MCPChild content= "Log in to review our service"/>
            </div>
        </div>
    </> );
}

export default memo(MCPSchedule);