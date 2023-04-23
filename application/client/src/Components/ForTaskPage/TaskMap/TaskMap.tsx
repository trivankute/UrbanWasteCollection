import { memo, useState } from "react";
import ReactMapGL, { Marker, Source, Layer, Popup } from 'react-map-gl';
import xerac from '../../../assets/vehicles/xerac.jpg'
import mcpImage from '../../../assets/MCP/mcp.png'
import disposalImage from '../../../assets/Disposal/disposal.png'
import "./lol.css"
import formatTime from "../../../utils/formatTime";

function TaskMap({routes, mcp, disposalFactories, vehicle, taskState}:{routes:any, mcp:any, disposalFactories:any, vehicle:any, taskState:any}) {
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
    const [vehiclePoint, setVehiclePoint] = useState<any>(()=>{
        const currentIndex = vehicle.currentMovingPointIndex
        const route1 = JSON.parse(routes[0]).geometry.coordinates
        const route2 = JSON.parse(routes[1]).geometry.coordinates
        if(currentIndex < route1.length){
            return {latitude: route1[currentIndex][1], longitude: route1[currentIndex][0]}
        }else if(currentIndex<route2.length){
            return {latitude: route2[currentIndex - route1.length][1], longitude: route2[currentIndex - route1.length][0]}
        }else {
            return {latitude: route2[route2.length-1][1], longitude: route2[route2.length-1][0]}
        }
    })

    const handleShowPopUp = ({latitude, longitude,type, disposalIndex}:{latitude:number, longitude:number,type:"vehicle"|"disposal"|"mcp", disposalIndex?:number}) => {
        setPopupInfo({latitude, longitude,type, disposalIndex})
        setShowPopup(true)
    }
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
                onClick={() => {handleShowPopUp({latitude: vehiclePoint.latitude, longitude: vehiclePoint.longitude, type: "vehicle"})}}
            >
                <img src={xerac} alt="My Marker" className=" w-10 h-10 cursor-pointer rounded-full hover:border-blue-700 border-2 border-blue-500" />
            </Marker>
            <Marker
                latitude={JSON.parse(JSON.parse(mcp.addressPoint))[1]}
                longitude={JSON.parse(JSON.parse(mcp.addressPoint))[0]}
                // get event when click on
                // @ts-ignore
                // onClick={handleMarkerClick}
                // @ts-ignore
                anchor="bottom"
                offsetTop={-20}
                offsetLeft={-10}
                mapStyle="mapbox://styles/mapbox/streets-v9"
                onClick={() => {handleShowPopUp({latitude: JSON.parse(JSON.parse(mcp.addressPoint))[1], longitude: JSON.parse(JSON.parse(mcp.addressPoint))[0], type: "mcp"})}}
            >
                <img src={mcpImage} alt="My Marker" className=" w-10 h-10 cursor-pointer rounded-full hover:border-blue-700 border-2 border-blue-500" />
            </Marker>
            {
                disposalFactories.map((disposalFactory:any, index:number) => {
                    return (
                        <Marker
                            latitude={JSON.parse(JSON.parse(disposalFactory.addressPoint))[1]}
                            longitude={JSON.parse(JSON.parse(disposalFactory.addressPoint))[0]}
                            // get event when click on
                            // @ts-ignore
                            // onClick={handleMarkerClick}
                            // @ts-ignore
                            anchor="bottom"
                            offsetTop={-20}
                            offsetLeft={-10}
                            mapStyle="mapbox://styles/mapbox/streets-v9"
                            onClick={() => {handleShowPopUp({latitude: JSON.parse(JSON.parse(disposalFactory.addressPoint))[1], longitude: JSON.parse(JSON.parse(disposalFactory.addressPoint))[0], type: "disposal", disposalIndex: index})}}
                        >
                            <img src={disposalImage} alt="My Marker" className=" w-10 h-10 cursor-pointer rounded-full hover:border-blue-700 border-2 border-blue-500" />
                        </Marker>
                    )
                })
            }
            {routes[0]&&(<Source id="route0" type="geojson" data={JSON.parse(routes[0])}>
                    <Layer
                        id="route0"
                        type="line"
                        source="route"
                        layout={{
                            "line-join": "round",
                            "line-cap": "round"
                        }}
                        paint={{
                            "line-color": "red",
                            "line-width": 2
                        }}
                    />
                </Source>
            )}
            {routes[1]&&(<Source id="route1" type="geojson" data={JSON.parse(routes[1])}>
                    <Layer

                        id="route1"
                        type="line"
                        source="route"
                        layout={{
                            "line-join": "round",
                            "line-cap": "round"
                        }}
                        paint={{
                            "line-color": "green",
                            "line-width": 2
                        }}
                    />
                </Source>
            )}
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
                                <div className="h-fit w-full capitalize">{"MCP: " + mcp.name}</div>
                                <div className="h-fit w-full capitalize">{"Capacity: " + mcp.capacity}</div>
                                <div className="h-fit w-full capitalize">{"UpdatedAt: " + formatTime(mcp.updatedAt)}</div>
                            </>
                        }
                        {
                            popupInfo.type === "disposal" && (
                                <div className="h-fit w-full capitalize">{"Disposal Factory: " + disposalFactories[popupInfo.disposalIndex].name}</div>
                            )
                        }
                    </div>
                </Popup>
            )}
        </ReactMapGL>
    </>);
}

export default memo(TaskMap);