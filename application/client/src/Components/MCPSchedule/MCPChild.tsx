import {memo} from 'react'
function MCPchild({content}:{content:string}) {
    return ( <>
        <div className="w-full border-b-[1px] hover:bg-gray-200 border-gray-200 bg-white flex justify-center items-center p-2">
            <span className="font-bold text-xs">{content}</span>
        </div>
    </> );
}

export default memo(MCPchild);