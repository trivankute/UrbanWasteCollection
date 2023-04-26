import { memo, useState, useEffect } from "react";
import ReactMapGL, { Marker, Source, Layer, Popup } from 'react-map-gl';
import mcpImage from '../../../assets/MCP/mcp.png'
import disposalImage from '../../../assets/Disposal/disposal.png'
import "./lol.css"
import formatTime from "../../../utils/formatTime";
import { useDispatch, useSelector } from "react-redux";
import { getAllDisposals } from "../../../redux/slices/DisposalsSlice";
import { DisposalsStore, MCPsStore, ResponsiveStore } from "../../../redux/selectors";
import { getAllMcps } from "../../../redux/slices/McpsSlice";
import clsx from "clsx";
import SmallNotification from "../../../redux/slices/Modals/SmallNotificationSlice";
// @ts-ignore
import polyline from '@mapbox/polyline';
import { Feature } from 'geojson';
import Spinner from "../../Spinner/Spinner";
import { beginViewPoint } from "../../../configs";
function TaskAddMap({ setDisposalBefore, setDisposalAfter, setMcpsForAdd, setRoutesForAdd }
    : { setDisposalBefore: any, setDisposalAfter: any, setMcpsForAdd: any, setRoutesForAdd: any }) {
    const isResponsive = useSelector(ResponsiveStore).data
    const [viewport, setViewport] = useState(beginViewPoint);
    const [showPopup, setShowPopup] = useState(false)
    const [popupInfo, setPopupInfo] = useState<any>(null)
    const dispatch = useDispatch<any>()
    const disposals = useSelector(DisposalsStore).disposals
    const mcps = useSelector(MCPsStore).mcps
    const handleShowPopUp = ({ latitude, longitude, type, index }: { latitude: number, longitude: number, type: "vehicle" | "disposal" | "mcp", index?: number }) => {
        setPopupInfo({ latitude, longitude, type, index })
        setShowPopup(true)
        setViewport((prev:any)=>{
            return {...prev, latitude, longitude}
        })
    }
    useEffect(() => {
        dispatch(getAllDisposals())
        dispatch(getAllMcps())
    }, [])
    const [disposalPoint1, setDisposalPoint1] = useState<any>(null)
    const [disposal1Signal, setDisposal1Signal] = useState<any>(false)
    const [disposalPoint2, setDisposalPoint2] = useState<any>(null)
    const [disposal2Signal, setDisposal2Signal] = useState<any>(false)
    const [mcpPoints, setMcpPoints] = useState<any>(null)
    const [mcpSignal, setMcpSignal] = useState<any>(false)
    const [routes, setRoutes] = useState<any>(null)
    function handleDisposalsClick(disposal: any) {
        const addressPoint =
        {
            id: disposal.id,
            name: disposal.name,
            latitude: JSON.parse(disposal.addressPoint)[1],
            longitude: JSON.parse(disposal.addressPoint)[0]
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
            latitude: JSON.parse(mcp.addressPoint)[1],
            longitude: JSON.parse(mcp.addressPoint)[0],
            capacity: mcp.capacity
        }
        if (mcpSignal) {
            // check if exist
            let checkExist = false
            if (mcpPoints)
                mcpPoints.forEach((mcp: any) => {
                    if (mcp.id === addressPoint.id) {
                        checkExist = true
                        return
                    }
                })
            if (!checkExist)
                setMcpPoints((prev: any) => {
                    if (prev) {
                        setMcpsForAdd([...prev, addressPoint])
                        return [...prev, addressPoint]
                    }
                    else {
                        setMcpsForAdd([addressPoint])
                        return [addressPoint]
                    }
                }
                )
            setMcpSignal(false)
        }
    }
    const [findLoading, setFindLoading] = useState(false)
    useEffect(() => {
        if (findLoading) {
            handleFind()
        }
    }, [findLoading])
    const handleFind = async () => {
        if (disposalPoint1 && disposalPoint2 && mcpPoints) {
            if (findLoading === false) {
                setFindLoading(true)
                return;
            }
            var requestOptions = {
                method: 'GET',
            };
            let routes: any = []
            let fetchUrl: string
            fetchUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${disposalPoint1.longitude},${disposalPoint1.latitude};${mcpPoints[0].longitude},${mcpPoints[0].latitude}?access_token=pk.eyJ1IjoidHJpdmFuN2ExNiIsImEiOiJjbDR3cTlwa2wwMXpzM2NvNHZwODZybmhoIn0.pshfsEO2bV10VYCFWIYLeQ`
            await fetch(fetchUrl, requestOptions)
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
                            coordinates: lineStringCoordinates,
                        },
                    };
                    routes.push(lineString)
                })
                .catch(error => console.log('error', error));
            for (let i = 0; i < mcpPoints.length - 1; i++) {
                fetchUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${mcpPoints[i].longitude},${mcpPoints[i].latitude};${mcpPoints[i + 1].longitude},${mcpPoints[i + 1].latitude}?access_token=pk.eyJ1IjoidHJpdmFuN2ExNiIsImEiOiJjbDR3cTlwa2wwMXpzM2NvNHZwODZybmhoIn0.pshfsEO2bV10VYCFWIYLeQ`
                await fetch(fetchUrl, requestOptions)
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
                                coordinates: lineStringCoordinates,
                            },
                        };
                        routes.push(lineString)
                    })
                    .catch(error => console.log('error', error));
            }
            fetchUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${mcpPoints[mcpPoints.length - 1].longitude},${mcpPoints[mcpPoints.length - 1].latitude};${disposalPoint2.longitude},${disposalPoint2.latitude}?access_token=pk.eyJ1IjoidHJpdmFuN2ExNiIsImEiOiJjbDR3cTlwa2wwMXpzM2NvNHZwODZybmhoIn0.pshfsEO2bV10VYCFWIYLeQ`
            await fetch(fetchUrl, requestOptions)
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
                            coordinates: lineStringCoordinates,
                        },
                    };
                    routes.push(lineString)
                })
                .catch(error => console.log('error', error));
            setRoutes(routes)
            setRoutesForAdd(routes)
            setFindLoading(false)
        }
        else {
            dispatch(SmallNotification.actions.handleOpen({ type: "error", content: "Please choose 2 disposals and 1 mcp" }))
        }
    }
    useEffect(() => {
        setViewport({
            ...viewport,
            height: 350,
            width: isResponsive ? 350 : 700,
        })

    }, [isResponsive])
    return (<div className="flex flex-col w-full h-fit space-y-4">
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
                                handleDisposalsClick(disposal)
                                handleShowPopUp({ latitude: JSON.parse(disposal.addressPoint)[1], longitude: JSON.parse(disposal.addressPoint)[0], type: "disposal", index: index })
                            }}
                        >
                            <img src={disposalImage} alt="My Marker" className={clsx(" w-10 h-10 cursor-pointer rounded-full hover:border-blue-700 border-2 border-blue-500", {
                                "border-yellow-500 hover:border-yellow-700": (() => {
                                    if ((disposalPoint1 && disposalPoint1.id === disposal.id) || (disposalPoint2 && disposalPoint2.id === disposal.id))
                                        return true
                                    else
                                        return false
                                })(),
                            })} />
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
                                handleMcpClick(mcp)
                            }}
                        >
                            <img src={mcpImage} alt="My Marker" className={clsx(" w-10 h-10 cursor-pointer rounded-full hover:border-blue-700 border-2 border-blue-500", {
                                "border-yellow-500 hover:border-yellow-700": (() => {
                                    if (!mcpPoints) return false;
                                    for (let i = 0; i < mcpPoints.length; i++) {
                                        if (mcpPoints[i].id === mcp.id) return true;
                                    }
                                    return false;
                                })(),
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
            {
                routes && routes.map((route: any, index: number) => {
                    return (
                        <Source id={"route" + index} type="geojson" data={route}>
                            <Layer

                                id={"route" + index}
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
                    )
                })
            }
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

            <div className="flex space-x-4">
                {
                    mcpPoints && mcpPoints.map((mcp: any, index: number) => {
                        return (<>
                            <div className="h-fit w-fit p-2 rounded-xl text-white bg-green-300">
                                MCP {index + 1}: {mcp.name}
                            </div>
                        </>)
                    })
                }
                <button onClick={() => {
                    setDisposal1Signal(false)
                    setDisposal2Signal(false)
                    setMcpSignal(true)
                }} className={clsx("h-fit w-fit p-2 rounded-xl text-white hover:bg-green-300", {
                    "bg-green-300": mcpSignal,
                    "bg-green-400": !mcpSignal
                })}>+ MCP</button>
            </div>

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
                setMcpPoints(null)
                setRoutes(null)
                setDisposalBefore(null)
                setDisposalAfter(null)
                setMcpsForAdd(null)
                setRoutesForAdd(null)
                setFindLoading(false)
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