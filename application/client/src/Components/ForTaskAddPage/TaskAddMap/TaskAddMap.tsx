import { memo, useState, useEffect } from "react";
import ReactMapGL, { Marker, Source, Layer, Popup } from 'react-map-gl';
import mcpImage from '../../../assets/MCP/mcp.png'
import disposalImage from '../../../assets/Disposal/disposal.png'
import "./lol.css"
import formatTime from "../../../utils/formatTime";
import { useDispatch, useSelector } from "react-redux";
import { getAllDisposals } from "../../../redux/slices/DisposalsSlice";
import { DisposalsStore, MCPsStore } from "../../../redux/selectors";
import { getAllMcps } from "../../../redux/slices/McpsSlice";
import clsx from "clsx";
import SmallNotification from "../../../redux/slices/Modals/SmallNotificationSlice";
// @ts-ignore
import polyline from '@mapbox/polyline';
import { Feature } from 'geojson';
import Spinner from "../../Spinner/Spinner";

function TaskAddMap({ setDisposalBefore,setDisposalAfter, setMcp, setRoute1ForStore, setRoute2ForStore }
    : { setDisposalBefore: any, setDisposalAfter:any, setMcp:any, setRoute1ForStore:any, setRoute2ForStore:any }) {
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
    const dispatch = useDispatch<any>()
    const disposals = useSelector(DisposalsStore).disposals
    const mcps = useSelector(MCPsStore).mcps
    const handleShowPopUp = ({ latitude, longitude, type, index }: { latitude: number, longitude: number, type: "vehicle" | "disposal" | "mcp", index?: number }) => {
        setPopupInfo({ latitude, longitude, type, index })
        setShowPopup(true)
    }
    useEffect(() => {
        dispatch(getAllDisposals())
        dispatch(getAllMcps())
    }, [])
    const [disposalPoint1, setDisposalPoint1] = useState<any>(null)
    const [disposal1Signal, setDisposal1Signal] = useState<any>(false)
    const [disposalPoint2, setDisposalPoint2] = useState<any>(null)
    const [disposal2Signal, setDisposal2Signal] = useState<any>(false)
    const [mcpPoint, setMcpPoint] = useState<any>(null)
    const [mcpSignal, setMcpSignal] = useState<any>(false)
    const [route1, setRoute1] = useState<any>(null)
    const [route2, setRoute2] = useState<any>(null)
    function handleDisposalsClick(disposal: any) {
        const addressPoint =
        {
            id: disposal.id,
            name: disposal.name,
            latitude: JSON.parse(JSON.parse(disposal.addressPoint))[1],
            longitude: JSON.parse(JSON.parse(disposal.addressPoint))[0]
        }
        if (disposalPoint1 === null && disposal1Signal === true) {
            setDisposalPoint1(addressPoint)
            setDisposalBefore(disposal)
        }
        else if (disposalPoint2 === null && disposal2Signal === true) {
            setDisposalPoint2(addressPoint)
            setDisposalAfter(disposal)
        }
    }
    function handleMcpClick(mcp: any) {
        const addressPoint =
        {
            id: mcp.id,
            name: mcp.name,
            latitude: JSON.parse(JSON.parse(mcp.addressPoint))[1],
            longitude: JSON.parse(JSON.parse(mcp.addressPoint))[0]
        }
        if (mcpPoint === null && mcpSignal) {
            setMcpPoint(addressPoint)
            setMcp(mcp)
        }
    }
    let findLoading = false
    const handleFind = async () => {
        if (disposalPoint1 && disposalPoint2 && mcpPoint) {
            var requestOptions = {
                method: 'GET',
            };
            findLoading = true
            await fetch(`https://api.mapbox.com/directions/v5/mapbox/driving/${disposalPoint1.longitude},${disposalPoint1.latitude};${mcpPoint.longitude},${mcpPoint.latitude}?access_token=pk.eyJ1IjoidHJpdmFuN2ExNiIsImEiOiJjbDR3cTlwa2wwMXpzM2NvNHZwODZybmhoIn0.pshfsEO2bV10VYCFWIYLeQ`, requestOptions)
                .then(response => response.text())
                .then(result => {
                    const route = JSON.parse(result);
                    const decodedGeometry = polyline.decode(route.routes[0].geometry);
                    const lineStringCoordinates = decodedGeometry.map((coordinate) => [coordinate[1], coordinate[0]]);
                    const lineString: Feature = {
                        type: 'Feature',
                        properties: {},
                        geometry: {
                            type: 'LineString',
                            coordinates: lineStringCoordinates
                        }
                    };
                    setRoute1(lineString);
                    setRoute1ForStore(lineString)
                })
                .catch(error => console.log('error', error));

            await fetch(`https://api.mapbox.com/directions/v5/mapbox/driving/${mcpPoint.longitude},${mcpPoint.latitude};${disposalPoint2.longitude},${disposalPoint2.latitude}?access_token=pk.eyJ1IjoidHJpdmFuN2ExNiIsImEiOiJjbDR3cTlwa2wwMXpzM2NvNHZwODZybmhoIn0.pshfsEO2bV10VYCFWIYLeQ`, requestOptions)
                .then(response => response.text())
                .then(result => {
                    const route = JSON.parse(result);
                    const decodedGeometry = polyline.decode(route.routes[0].geometry);
                    const lineStringCoordinates = decodedGeometry.map((coordinate) => [coordinate[1], coordinate[0]]);
                    const lineString: Feature = {
                        type: 'Feature',
                        properties: {},
                        geometry: {
                            type: 'LineString',
                            coordinates: lineStringCoordinates
                        }
                    };
                    setRoute2(lineString);
                    setRoute2ForStore(lineString)
                    findLoading = false
                })
                .catch(error => console.log('error', error));
        }
        else {
            dispatch(SmallNotification.actions.handleOpen({ type: "error", content: "Please choose 2 disposals and 1 mcp" }))
        }
    }
    return (<div className="flex flex-col w-full h-fit space-y-4">
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
                disposals && disposals.map((disposal: any, index: number) => {
                    return (
                        <Marker
                            latitude={JSON.parse(JSON.parse(disposal.addressPoint))[1]}
                            longitude={JSON.parse(JSON.parse(disposal.addressPoint))[0]}
                            // get event when click on
                            // @ts-ignore
                            // onClick={handleMarkerClick}
                            // @ts-ignore
                            anchor="bottom"
                            offsetTop={-20}
                            offsetLeft={-10}
                            mapStyle="mapbox://styles/mapbox/streets-v9"
                            onClick={(e: any) => {
                                handleDisposalsClick(disposal)
                                handleShowPopUp({ latitude: JSON.parse(JSON.parse(disposal.addressPoint))[1], longitude: JSON.parse(JSON.parse(disposal.addressPoint))[0], type: "disposal", index: index })
                            }}
                        >
                            <img src={disposalImage} alt="My Marker" className={clsx(" w-10 h-10 cursor-pointer rounded-full hover:border-blue-700 border-2 border-blue-500", {
                                "border-yellow-500 hover:border-yellow-700": ((disposalPoint1 && disposalPoint1.id === disposal.id) || (disposalPoint2 && disposalPoint2.id === disposal.id)),
                            })} />
                        </Marker>
                    )
                })
            }
            {
                mcps && mcps.map((mcp: any, index: number) => {
                    return (
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
                            onClick={(e: any) => {
                                handleShowPopUp({ latitude: JSON.parse(JSON.parse(mcp.addressPoint))[1], longitude: JSON.parse(JSON.parse(mcp.addressPoint))[0], type: "mcp", index: index })
                                handleMcpClick(mcp)
                            }}
                        >
                            <img src={mcpImage} alt="My Marker" className={clsx(" w-10 h-10 cursor-pointer rounded-full hover:border-blue-700 border-2 border-blue-500", {
                                "border-yellow-500 hover:border-yellow-700": (mcpPoint && mcpPoint.id === mcp.id),
                            })} />
                        </Marker>
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
                            popupInfo.type === "mcp" && <>
                                <div className="h-fit w-full capitalize">{"MCP: " + mcps[popupInfo.index].name}</div>
                                <div className="h-fit w-full capitalize">{"Capacity: " + mcps[popupInfo.index].capacity}</div>
                                <div className="h-fit w-full capitalize">{"UpdatedAt: " + formatTime(mcps[popupInfo.index].updatedAt)}</div>
                            </>
                        }
                        {
                            popupInfo.type === "disposal" && (
                                <div className="h-fit w-full capitalize">{"Disposal address: " + disposals[popupInfo.index].name}</div>
                            )
                        }
                    </div>
                </Popup>
            )}
            {route1 && (<Source id="route1" type="geojson" data={route1}>
                <Layer

                    id="route1"
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
            {route2 && (<Source id="route2" type="geojson" data={route2}>
                <Layer

                    id="route2"
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
        </ReactMapGL>
        <div className="w-full h-fit flex flex-col space-y-2">
            <button onClick={() => {
                setDisposal1Signal(true)
                setDisposal2Signal(false)
                setMcpSignal(false)
            }} className={clsx("h-fit w-fit p-2 rounded-xl text-white hover:bg-green-300", {
                "bg-green-300": disposal1Signal,
                "bg-green-400": !disposal1Signal
            })}>Choose Departure Disposal{disposalPoint1 && `: ${disposalPoint1.name}`}</button>
            <button onClick={() => {
                setDisposal1Signal(false)
                setDisposal2Signal(false)
                setMcpSignal(true)
            }} className={clsx("h-fit w-fit p-2 rounded-xl text-white hover:bg-green-300", {
                "bg-green-300": mcpSignal,
                "bg-green-400": !mcpSignal
            })}>Choose MCP{mcpPoint && `: ${mcpPoint.name}`}</button>
            <button onClick={() => {
                setDisposal1Signal(false)
                setDisposal2Signal(true)
                setMcpSignal(false)
            }} className={clsx("h-fit w-fit p-2 rounded-xl text-white hover:bg-green-300", {
                "bg-green-300": disposal2Signal,
                "bg-green-400": !disposal2Signal
            })}>Choose Arrival Disposal{disposalPoint2 && `: ${disposalPoint2.name}`}</button>
            <button onClick={() => {
                setDisposal1Signal(false)
                setDisposal2Signal(false)
                setMcpSignal(false)
                setDisposalPoint1(null)
                setDisposalPoint2(null)
                setMcpPoint(null)
                setRoute1(null)
                setRoute2(null)
                setDisposalBefore(null)
                setDisposalAfter(null)
                setMcp(null)
                setRoute2ForStore(null)
                setRoute1ForStore(null)
            }} className={clsx("h-fit w-fit p-2 rounded-xl text-white bg-green-400 hover:bg-green-300", {
            })}>Reset All</button>
            <button onClick={() => {
                handleFind()
            }} className={clsx("h-fit w-fit p-2 rounded-xl text-white bg-green-400 hover:bg-green-300", {
            })}>{
                    findLoading ?
                        <div className="w-full h-full flex justify-center items-center">
                            <Spinner />
                        </div>
                        :
                        "Find"
            }</button>
        </div>
    </div>);
}

export default memo(TaskAddMap);