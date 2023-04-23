import { memo } from "react";
import { useSelector } from "react-redux";
import { UserStore } from "../../../redux/selectors";

function UserDetailCard() {
    const user = useSelector(UserStore).data
    return (<>
        <div className="bg-white shadow-lg rounded-xl overflow-hidden min-w-0 w-[100%] max-w-[500px] h-fit flex flex-col p-8 space-y-4">
            <div className="w-full flex justify-center items-center">
                <span className="font-semibold capitalize text-sm">Profile details</span>
            </div>
            <span className="text-sm font-semibold capitalize">Address: <span className="text-sm font-normal">{user.address}</span></span>
            <span className="text-sm font-semibold capitalize">Birthday: <span className="text-sm font-normal">{user.birthday}</span></span>
            <span className="text-sm font-semibold capitalize">Email: <span className="text-sm font-normal">{user.email}</span></span>
            <span className="text-sm font-semibold capitalize">Gender: <span className="text-sm font-normal">{user.gender}</span></span>
            {
                user.role !== "backofficer" &&
                <span className="text-sm font-semibold capitalize">Vehicle: <span className="text-sm font-normal">{user.vehicleId}</span></span>
            }
            <span className="text-sm font-semibold capitalize">Disposal Name: <span className="text-sm font-normal">{user.disposalFactory.name}</span></span>
            <button className="bg-[#477BE1] rounded-xl w-40 h-fit p-2 text-white">Adjust</button>
        </div>
    </>);
}

export default memo(UserDetailCard);