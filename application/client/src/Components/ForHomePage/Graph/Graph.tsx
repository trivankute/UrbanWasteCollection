import { memo, useEffect, useState, useCallback } from "react"
import ReactMapGL, { Marker, Source, Layer, Popup } from 'react-map-gl';
import mcpImage from '../../../assets/MCP/mcp.png'
import disposalImage from '../../../assets/Disposal/disposal.png'
import xerac from '../../../assets/vehicles/xerac.jpg'
import { useDispatch, useSelector } from "react-redux";
import { DisposalsStore, HomeInteractingStore, MCPsStore, ResponsiveStore, TasksStore } from "../../../redux/selectors";
import socket, { callVehiclesAfterUpdateAddressHandle, callVehiclesAfterUpdateAddressEvent } from "../../../utils/socket";
import { searchTasks } from "../../../redux/slices/TasksSlice";
import { getAllDisposals } from "../../../redux/slices/DisposalsSlice";
import { getAllMcps } from "../../../redux/slices/McpsSlice";
import formatTime from "../../../utils/formatTime";
import { handleSearchVehicle } from "../../../redux/slices/VehiclesSlice";
import HomeInteractingSlice from "../../../redux/slices/HomeInteractingMapAndTask/HomeInteractingSlice";
import clsx from "clsx";
import { beginViewPoint } from "../../../configs";
const Graph = () => {
    const [popupInfo, setPopupInfo] = useState<any>(null)
    const [showPopup, setShowPopup] = useState(false);
    const isResponsive = useSelector(ResponsiveStore).data
    const tasks = useSelector(TasksStore).tasks
    const disposals = useSelector(DisposalsStore).disposals
    const mcps = useSelector(MCPsStore).mcps
    const dispatch = useDispatch<any>()
    const [viewport, setViewport] = useState(beginViewPoint);
    const [vehiclePoints, setVehiclePoints] = useState<any>([])
    const handleShowPopUp = ({ latitude, longitude, type, index }: { latitude: number, longitude: number, type: "vehicle" | "disposal" | "mcp", index?: number }) => {
        setPopupInfo({ latitude, longitude, type, index })
        setShowPopup(true)
        setViewport((prev:any)=>{
            return {...prev, latitude, longitude}
        })
    }
    const callAllInProgressVehicle = useCallback(() => {
        dispatch(handleSearchVehicle(
            {
                "page": 1,
                "pageSize": 20,
                "numberPlate": "",
                "type": "",
                "state": "in progress",
                "disposalName": ""
            }
        ))
            .then((res: any) => {
                if (res.payload.status === "success") {
                    let newVehiclePointsArray: any = []
                    res.payload.data.forEach((vehicle: any) => {
                        const routes = vehicle.task.routes
                        let currentPointLimit = 0;
                        let pointIndex = vehicle.currentMovingPointIndex
                        let addressPoint = {}
                        for(let i=0; i<routes.length; i++) {
                            const route = JSON.parse(routes[i]).geometry.coordinates
                            if (pointIndex < route.length + currentPointLimit) {
                                addressPoint = { latitude: route[pointIndex - currentPointLimit][1], longitude: route[pointIndex - currentPointLimit][0] }
                                break
                            }
                            else {
                                currentPointLimit += route.length
                            }
                        }
                        newVehiclePointsArray.push({ ...vehicle, ...addressPoint}) 
                    })
                    setVehiclePoints(newVehiclePointsArray)
                }
            })
    }, [])
    useEffect(() => {
        dispatch(getAllDisposals())
        dispatch(getAllMcps())
        dispatch(searchTasks({
            "page": 1,
            "pageSize": 20,
            "name": "",
            "type": "",
            "state": "",
            "disposalName": "",
            "mcpName": ""
        }))
        callAllInProgressVehicle()
        callVehiclesAfterUpdateAddressHandle(callAllInProgressVehicle)
        return () => {
            socket.off(callVehiclesAfterUpdateAddressEvent)
        }
    }, [])
    useEffect(() => {
        setViewport({
            ...viewport,
            height: 350,
            width: isResponsive ? 350 : 700,
        })

    }, [isResponsive])
    // for home interacting
    const taskIdForHomeInteracting = useSelector(HomeInteractingStore).taskId
    const forChangeViewToVehicleId = useSelector(HomeInteractingStore).forChangeViewtoVehicleId
    useEffect(()=>{
        setViewport((prev:any)=>{
            const vehicle = vehiclePoints.find((vehicle:any)=>vehicle.id === forChangeViewToVehicleId)
            if(vehicle){
                return {...prev, latitude: vehicle.latitude, longitude: vehicle.longitude}
            }
            return prev
        })
    },[forChangeViewToVehicleId])
    return (<>
        <ReactMapGL
            {...viewport}
            mapboxApiAccessToken="pk.eyJ1IjoidHJpdmFuN2ExNiIsImEiOiJjbDR3cTlwa2wwMXpzM2NvNHZwODZybmhoIn0.pshfsEO2bV10VYCFWIYLeQ"
            onViewportChange={(nextViewport: any) => setViewport({
                ...nextViewport,
                height: 350,
                width: isResponsive ? 350 : 700,
            })}
            className="rounded-xl drop-shadow-xl"
        // onClick={handleMapClick}
        >
            {
                vehiclePoints && vehiclePoints.map((vehiclePoint: any, index: number) => {
                    return (
                        <>
                            <Marker
                                latitude={vehiclePoint.latitude}
                                longitude={vehiclePoint.longitude}
                                // get event when click on
                                // @ts-ignore
                                // onClick={handleMarkerClick}
                                // @ts-ignore
                                anchor="bottom"
                                offsetTop={-20}
                                offsetLeft={-10}
                                mapStyle="mapbox://styles/mapbox/streets-v9"
                                onClick={() => {
                                    dispatch(HomeInteractingSlice.actions.handleFillVehicleId(vehiclePoint.id))
                                    handleShowPopUp({ latitude: vehiclePoint.latitude, longitude: vehiclePoint.longitude, type: "vehicle", index: index })
                                }}
                                style={{zIndex:5}}
                            >
                                <img src={xerac} alt="My Marker" className={clsx("w-10 h-10 cursor-pointer rounded-full hover:border-pink-700 border-2 border-red-500", {
                                    "border-yellow-500 w-16 h-16": taskIdForHomeInteracting === vehiclePoint.task.id
                                })} />
                            </Marker>
                        </>
                    )
                })
            }
            {
                disposals && disposals.map((disposal: any, index: number) => {
                    return (
                        <Marker
                            latitude={JSON.parse(disposal.addressPoint)[1]}
                            longitude={JSON.parse(disposal.addressPoint)[0]}
                            // get event when click on
                            // @ts-ignore
                            // onClick={handleMarkerClick}
                            // @ts-ignore
                            anchor="bottom"
                            offsetTop={-20}
                            offsetLeft={-10}
                            mapStyle="mapbox://styles/mapbox/streets-v9"
                            onClick={(e: any) => {
                                handleShowPopUp({ latitude: JSON.parse(disposal.addressPoint)[1], longitude: JSON.parse(disposal.addressPoint)[0], type: "disposal", index: index })
                            }}
                        >
                            <img src={disposalImage} alt="My Marker" className=" w-10 h-10 cursor-pointer rounded-full hover:border-blue-700 border-2 border-blue-500" />
                        </Marker>
                    )
                })
            }
            {
                mcps && mcps.map((mcp: any, index: number) => {
                    return (
                        <Marker
                            latitude={JSON.parse(mcp.addressPoint)[1]}
                            longitude={JSON.parse(mcp.addressPoint)[0]}
                            // get event when click on
                            // @ts-ignore
                            // onClick={handleMarkerClick}
                            // @ts-ignore
                            anchor="bottom"
                            offsetTop={-20}
                            offsetLeft={-10}
                            mapStyle="mapbox://styles/mapbox/streets-v9"
                            onClick={(e: any) => {
                                handleShowPopUp({ latitude: JSON.parse(mcp.addressPoint)[1], longitude: JSON.parse(mcp.addressPoint)[0], type: "mcp", index: index })
                            }}
                        >
                            <img src={mcpImage} alt="My Marker" className=" w-10 h-10 cursor-pointer rounded-full hover:border-blue-700 border-2 border-blue-500" />
                        </Marker>
                    )
                })
            }
            {
                tasks && tasks.map((task: any, taskIndex: number) => {
                    const routes = task.routes
                    return routes.map((route:any, routeIndex:number)=>{
                        return (
                            <>
                                <Source id={`route${taskIndex}${routeIndex}`} type="geojson" data={JSON.parse(route)}>
                                    <Layer
                                        id={`route${taskIndex}${routeIndex}`}
                                        type="line"
                                        source="route"
                                        layout={{
                                            "line-join": "round",
                                            "line-cap": "round"
                                        }}
                                        paint={{
                                            "line-color": routeIndex===routes.length-1?"green":"red",
                                            "line-width": 2
                                        }}
                                    />
                                </Source>
                            </>
                        )
                    })

                })
            }
            {showPopup && (
                <Popup
                    latitude={popupInfo.latitude}
                    longitude={popupInfo.longitude}
                    closeButton={true}
                    onClose={() => setShowPopup(false)}
                    anchor="top"
                    offsetTop={20}
                    offsetLeft={0}
                >
                    <div
                        className="h-fit w-fit text-sm"
                    >
                        <div className="h-fit w-full capitalize font-semibold pb-2 border-b">{popupInfo.type + " Detail:"}</div>
                        {
                            popupInfo.type === "vehicle" && <>
                                <div className="h-fit w-full capitalize">{"Vehicle: " + vehiclePoints[popupInfo.index].numberPlate}</div>
                                <div className="h-fit w-full capitalize">{"Fuel: " + vehiclePoints[popupInfo.index].fuel}</div>
                                <div className="h-fit w-full capitalize">{"Capacity: " + vehiclePoints[popupInfo.index].capacity}</div>
                                <div className="h-fit w-full capitalize">{"State: " + vehiclePoints[popupInfo.index].state}</div>
                                <div className="h-fit w-full capitalize">{"Type: " + vehiclePoints[popupInfo.index].type}</div>
                                <div className="h-fit w-full capitalize">{"Workers Number: " + vehiclePoints[popupInfo.index].workers.length}</div>
                            </>
                        }
                        {
                            popupInfo.type === "mcp" && <>
                                <div className="h-fit w-full capitalize">{"MCP: " + mcps[popupInfo.index].name}</div>
                                <div className="h-fit w-full capitalize">{"Capacity: " + mcps[popupInfo.index].capacity}</div>
                                <div className="h-fit w-full capitalize">{"UpdatedAt: " + formatTime(mcps[popupInfo.index].updatedAt)}</div>
                            </>
                        }
                        {
                            popupInfo.type === "disposal" && (
                                <div className="h-fit w-full capitalize">{"Disposal Factory: " + disposals[popupInfo.index].name}</div>
                            )
                        }
                    </div>
                </Popup>
            )}
        </ReactMapGL>
    </>);
}

export default memo(Graph);