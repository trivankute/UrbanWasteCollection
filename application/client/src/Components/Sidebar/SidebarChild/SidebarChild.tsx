import clsx from 'clsx';
import {memo} from 'react'
import { useDispatch } from 'react-redux';
import {useLocation, useNavigate} from 'react-router-dom'
import MenuSlice from '../../../redux/slices/MenuSlice';
function SidebarChild({content, link}:{content:string, link:string}) {
    const location = useLocation();
    const dispatch = useDispatch<any>()
    const navigate = useNavigate();
    return ( <>
        <li onClick={()=>{
            navigate(`/admin/${link}`);
            dispatch(MenuSlice.actions.toggleHandle({}))
        }} className={clsx(" bg-[#D9D9D9] rounded-md shadow-md", {
            "border-green-400 border-2": location.pathname.includes(`/admin/${link}`)
        })}>
            <div className="cursor-pointer flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                <span className="flex-1 ml-3 whitespace-nowrap">{content}</span>
            </div>
        </li>
    </> );
}

export default memo(SidebarChild);