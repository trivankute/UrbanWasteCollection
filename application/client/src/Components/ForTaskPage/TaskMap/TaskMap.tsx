import { memo, useState, useEffect, useCallback } from "react";
import ReactMapGL, { Marker, Source, Layer, Popup } from 'react-map-gl';
import xerac from '../../../assets/vehicles/xerac.jpg'
import mcpImage from '../../../assets/MCP/mcp.png'
import disposalImage from '../../../assets/Disposal/disposal.png'
import "./lol.css"
import formatTime from "../../../utils/formatTime";
import { useDispatch } from "react-redux";
import { getVehicleById } from "../../../redux/slices/VehiclesSlice";
import socket, { callVehiclesAfterUpdateAddressEvent, callVehiclesAfterUpdateAddressHandle } from "../../../utils/socket";

function TaskMap({ routes, mcps, disposalFactories, vehicle, state }: { state:string, routes: any, mcps: any, disposalFactories: any, vehicle: any }) {
    const dispatch = useDispatch<any>()
    const [viewport, setViewport] = useState({
        height: 350,
        width: 550,
        latitude: 10.74427004016835,
        longitude: 106.65824255703593,
        name: "cao xuan duc",
        zoom: 14.5
    });
    const [showPopup, setShowPopup] = useState(false)
    const [popupInfo, setPopupInfo] = useState<any>(null)
    const [vehiclePoint, setVehiclePoint] = useState<any>()

    const handleShowPopUp = ({ latitude, longitude, type, index }: { latitude: number, longitude: number, type: "vehicle" | "disposal" | "mcp", index?: number }) => {
        setPopupInfo({ latitude, longitude, type, index })
        setShowPopup(true)
    }

    const callSpecificVehicle = useCallback(() => {
        dispatch(getVehicleById(vehicle.id))
        .then((res:any)=>{
            let currentPointLimit = 0;
            let pointIndex = res.payload.data.currentMovingPointIndex
            let addressPoint = {}
            routes.map((routeJson: any, index: number) => {
                const route = JSON.parse(routeJson).geometry.coordinates
                if (pointIndex < route.length + currentPointLimit) {
                    addressPoint = { latitude: route[pointIndex - currentPointLimit][1], longitude: route[pointIndex - currentPointLimit][0] }
                    return
                }
                else {
                    currentPointLimit += route.length
                }
            })
            setVehiclePoint({ ...vehicle, ...addressPoint })
        })
    }, [])

    useEffect(() => {
        if(state!=="done")
        {
            callSpecificVehicle()
            callVehiclesAfterUpdateAddressHandle(callSpecificVehicle)
            return () => {
                socket.off(callVehiclesAfterUpdateAddressEvent)
            }
        }
    }, [])
    return (<>
        <ReactMapGL
            {...viewport}
            mapboxApiAccessToken="pk.eyJ1IjoidHJpdmFuN2ExNiIsImEiOiJjbDR3cTlwa2wwMXpzM2NvNHZwODZybmhoIn0.pshfsEO2bV10VYCFWIYLeQ"
            onViewportChange={(nextViewport: any) => setViewport({
                name: viewport.name, ...nextViewport,
            })}
            className="rounded-xl drop-shadow-xl"
        // onClick={handleMapClick}
        >
            {
                vehiclePoint && 
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
                    onClick={() => { handleShowPopUp({ latitude: vehiclePoint.latitude, longitude: vehiclePoint.longitude, type: "vehicle" }) }}
                >
                    <img src={xerac} alt="My Marker" className=" w-10 h-10 cursor-pointer rounded-full hover:border-blue-700 border-2 border-blue-500" />
                </Marker>
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
                            onClick={() => { handleShowPopUp({ latitude: JSON.parse(mcp.addressPoint)[1], longitude: JSON.parse(mcp.addressPoint)[0], type: "mcp", index: index }) }}
                        >
                            <img src={mcpImage} alt="My Marker" className=" w-10 h-10 cursor-pointer rounded-full hover:border-blue-700 border-2 border-blue-500" />
                        </Marker>
                    )
                })
            }
            {
                disposalFactories.map((disposalFactory: any, index: number) => {
                    return (
                        <Marker
                            latitude={JSON.parse(disposalFactory.addressPoint)[1]}
                            longitude={JSON.parse(disposalFactory.addressPoint)[0]}
                            // get event when click on
                            // @ts-ignore
                            // onClick={handleMarkerClick}
                            // @ts-ignore
                            anchor="bottom"
                            offsetTop={-20}
                            offsetLeft={-10}
                            mapStyle="mapbox://styles/mapbox/streets-v9"
                            onClick={() => { handleShowPopUp({ latitude: JSON.parse(disposalFactory.addressPoint)[1], longitude: JSON.parse(disposalFactory.addressPoint)[0], type: "disposal", index: index }) }}
                        >
                            <img src={disposalImage} alt="My Marker" className=" w-10 h-10 cursor-pointer rounded-full hover:border-blue-700 border-2 border-blue-500" />
                        </Marker>
                    )
                })
            }
            {
                routes && routes.map((route: any, index: number) => {
                    return (
                        <>
                            <Source id={`route-${index}`} type="geojson" data={JSON.parse(route)}>
                                <Layer
                                    id={`route-${index}`}
                                    type="line"
                                    source="route"
                                    layout={{
                                        "line-join": "round",
                                        "line-cap": "round"
                                    }}
                                    paint={{
                                        "line-color": index === routes.length - 1 ? "green" : "red",
                                        "line-width": 2
                                    }}
                                />
                            </Source>
                        </>
                    )
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
                        <div className="h-fit w-full capitalize pb-2 border-b">{popupInfo.type + " Detail:"}</div>
                        {
                            popupInfo.type === "vehicle" && <>
                                <div className="h-fit w-full capitalize">{"Vehicle: " + vehicle.numberPlate}</div>
                                <div className="h-fit w-full capitalize">{"Fuel: " + vehicle.fuel}</div>
                                <div className="h-fit w-full capitalize">{"Capacity: " + vehicle.capacity}</div>
                                <div className="h-fit w-full capitalize">{"State: " + vehicle.state}</div>
                                <div className="h-fit w-full capitalize">{"Type: " + vehicle.type}</div>
                                <div className="h-fit w-full capitalize">{"Workers Number: " + vehicle.workers.length}</div>
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
                                <div className="h-fit w-full capitalize">{"Disposal Factory: " + disposalFactories[popupInfo.index].name}</div>
                            )
                        }
                    </div>
                </Popup>
            )}
        </ReactMapGL>
    </>);
}

export default memo(TaskMap);