import { memo } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import HomeInteractingSlice from '../../../redux/slices/HomeInteractingMapAndTask/HomeInteractingSlice';
import { HomeInteractingStore } from '../../../redux/selectors';
import clsx from 'clsx';
function MCPchild({ content, onClick, taskId, vehicleId }: { content: string, onClick?: any, taskId?: string, vehicleId?:string }) {
    const dispatch = useDispatch<any>()
    const vehicleIdForHomeInteracting = useSelector(HomeInteractingStore).vehicleId
    console.log(vehicleIdForHomeInteracting, vehicleId)
    return (<>
        <div onClick={() => {
            if (onClick)
                onClick()
            if (taskId)
                dispatch(HomeInteractingSlice.actions.handleFillTaskId(taskId));
        }}
            onMouseEnter={() => {
                if (taskId)
                    dispatch(HomeInteractingSlice.actions.handleFillTaskId(taskId));
            }}
            onMouseLeave={() => {
                if (taskId)
                    dispatch(HomeInteractingSlice.actions.handleFillTaskId(""));
            }}
            className={clsx("cursor-pointer w-full border-b-[1px] hover:bg-gray-200 border-gray-200 bg-white flex justify-center items-center p-2", {
                "bg-green-200": vehicleIdForHomeInteracting === vehicleId,
            })}>
            <span className="font-bold text-xs">{content}</span>
        </div>
    </>);
}

export default memo(MCPchild);