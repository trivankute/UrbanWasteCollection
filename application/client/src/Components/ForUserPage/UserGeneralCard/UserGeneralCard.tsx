import { memo } from "react";
import xerac from '../../../assets/vehicles/xerac.jpg'
import { useSelector } from "react-redux";
import { UserStore } from "../../../redux/selectors";

function UserGeneralCard() {
    const user = useSelector(UserStore).data
    return (<>
        <div className="bg-white shadow-lg rounded-xl overflow-hidden w-[250px] h-fit flex flex-col p-8 space-y-4">
            <div className="w-full flex justify-center items-center my-6">
                <img src={xerac} className="w-16 h-16 rounded-full shadow-md" />
            </div>
            <span className="font-semibold capitalize text-sm">Name: {user.name}</span>
            <span className="text-sm font-semibold capitalize">Role: {user.role}</span>
            <span className="text-sm font-semibold capitalize">Tel: <span className="text-sm font-normal">{user.phone}</span></span>
            <span className="text-sm font-semibold capitalize">Nationality: <span className="text-sm font-normal">{user.nationality}</span></span>
        </div>
    </>);
}

export default memo(UserGeneralCard);