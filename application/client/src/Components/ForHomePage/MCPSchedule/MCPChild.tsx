import { memo } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import HomeInteractingSlice from '../../../redux/slices/HomeInteractingMapAndTask/HomeInteractingSlice';
import { HomeInteractingStore } from '../../../redux/selectors';
import clsx from 'clsx';
function MCPchild({ content, onClick, taskId, vehicleId }: { content: string, onClick?: any, taskId?: string, vehicleId?: string }) {
    const dispatch = useDispatch<any>()
    const vehicleIdForHomeInteracting = useSelector(HomeInteractingStore).vehicleId
    return (<>
        <div onClick={() => {
            if (onClick)
                onClick()
            if (taskId)
                dispatch(HomeInteractingSlice.actions.handleFillTaskId(taskId));
            if (vehicleId)
                dispatch(HomeInteractingSlice.actions.handleForChangeViewToVehicle(vehicleId));
        }}
            onMouseEnter={() => {
                if (taskId)
                    dispatch(HomeInteractingSlice.actions.handleFillTaskId(taskId));
                if (vehicleId)
                    dispatch(HomeInteractingSlice.actions.handleForChangeViewToVehicle(vehicleId));
            }}
            onMouseLeave={() => {
                if (taskId)
                    dispatch(HomeInteractingSlice.actions.handleFillTaskId(""));
                if (vehicleId)
                    dispatch(HomeInteractingSlice.actions.handleForChangeViewToVehicle(""));
            }}
            className={clsx("cursor-pointer w-full border-b-[1px] hover:bg-gray-200 border-gray-200 flex justify-center items-center p-2", {
                "bg-red-300": vehicleIdForHomeInteracting === vehicleId,
                "bg-white": vehicleIdForHomeInteracting !== vehicleId
            })}
        >
            <span className="font-bold text-xs">{content}</span>
        </div>
    </>);
}

export default memo(MCPchild);