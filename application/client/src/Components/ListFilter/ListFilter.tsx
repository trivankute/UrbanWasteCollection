import { memo } from "react";

//this function is for filtering the list
function ListFilter({ ListArrayText, setState=null }: { ListArrayText: string[], setState?: any }) {
    return (<>
        <select onChange={(e) => {
            if (setState)
                setState(e.target.value)
        }} id="countries" className="cursor-pointer w-[100%] max-w-[150px] rounded-xl shadow-xl flex items-center capitalize border-none justify-center text-green-400 focus:border-green-400 focus:ring-green-400">
            {
                ListArrayText.map((item, index) => {
                    return <option className="text-sm font-normal text-green-400 capitalize" selected={index === 0 ? true : false} value={index === 0 ? "" : item} key={index}>{item}</option>
                })
            }
        </select>
    </>);
}

export default memo(ListFilter);