// apply
// react-map-gl 6.1.13
// mapbox-gl 2.3.1
// @types/mapbox-gl
// @types/react-map-gl
// @types/geojson
// @mapbox/polyline
// @types/mapbox__polyline
// geojson
// pk.eyJ1IjoidHJpdmFuN2ExNiIsImEiOiJjbDR3cTlwa2wwMXpzM2NvNHZwODZybmhoIn0.pshfsEO2bV10VYCFWIYLeQ

import { useState, useEffect } from 'react';
import ReactMapGL, { Marker, Source, Layer } from 'react-map-gl';
import mapboxgl from 'mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
// import google from "../../assets/icon/google.png"
// @ts-ignore
import polyline from '@mapbox/polyline';
import { Feature, FeatureCollection } from 'geojson';
import 'mapbox-gl/dist/mapbox-gl.css';


mapboxgl.accessToken = 'pk.eyJ1IjoidHJpdmFuN2ExNiIsImEiOiJjbDR3cTlwa2wwMXpzM2NvNHZwODZybmhoIn0.pshfsEO2bV10VYCFWIYLeQ';
const TestGraph = () => {
    const [startPoint, setStartPoint] = useState<any>(null);
    const [endPoint, setEndPoint] = useState<any>(null);

    const [viewport, setViewport] = useState({
        width: 400,
        height: 400,
        latitude: 10.74436, hkhk
        longitude: 106.6559759,
        zoom: 15
    });
    /////////////////////////////// for get route between 1 onclick point
    const [from, setFrom] = useState<any>(null);
    const [to, setTo] = useState<any>(null);
    const [routeFeature, setRouteFeature] = useState<any>(null);

    const handleMapClick = (event: any) => {
        const clickedMarker = {
            latitude: event.lngLat[1],
            longitude: event.lngLat[0]
        };

        if (!from) {
            setFrom(clickedMarker);
            setStartPoint({ longitude: clickedMarker.longitude, latitude: clickedMarker.latitude });
        } else if (!to) {
            setTo(clickedMarker);
            setEndPoint({ longitude: clickedMarker.longitude, latitude: clickedMarker.latitude });
        }
    };
    const handleFind = () => {
        if (from && to) {
            var requestOptions = {
                method: 'GET',
              };

            fetch(`https://api.mapbox.com/directions/v5/mapbox/driving/${from.longitude},${from.latitude};${to.longitude},${to.latitude}?access_token=pk.eyJ1IjoidHJpdmFuN2ExNiIsImEiOiJjbDR3cTlwa2wwMXpzM2NvNHZwODZybmhoIn0.pshfsEO2bV10VYCFWIYLeQ`, requestOptions)
                .then(response => response.text())
                .then(result => {
                    const route = JSON.parse(result);
                    setStartPoint(()=>{
                        return {...startPoint,name:route.waypoints[0].name}
                    })
                    setEndPoint(()=>{
                        return {...endPoint,name:route.waypoints[1].name}
                    })
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
                    setRouteFeature(lineString);
                })
                .catch(error => console.log('error', error));
        }
    }
    const handleMove = () => {
            const handleMoveLOL = setInterval(()=>{
                let lineStringCoordinates = routeFeature.geometry.coordinates;
                if (lineStringCoordinates.length > 0) {
                    const [longitude, latitude] = lineStringCoordinates.shift() as [number, number];
                    setFrom({ longitude, latitude });
                }
                else {
                    clearInterval(handleMoveLOL);
                }
    
            },500)
    }
    return (
        <>
            <ReactMapGL
                {...viewport}
                mapboxApiAccessToken="pk.eyJ1IjoidHJpdmFuN2ExNiIsImEiOiJjbDR3cTlwa2wwMXpzM2NvNHZwODZybmhoIn0.pshfsEO2bV10VYCFWIYLeQ"
                onViewportChange={(nextViewport: any) => setViewport(nextViewport)}
                onClick={handleMapClick}
            >
                {
                    from &&
                    <Marker
                        latitude={from.latitude}
                        longitude={from.longitude}
                        // get event when click on
                        // @ts-ignore
                        // onClick={handleMarkerClick}
                        // @ts-ignore
                        anchor="bottom"
                        offsetTop={-20}
                        offsetLeft={-10}
                        mapStyle="mapbox://styles/mapbox/streets-v9"
                    >
                        <img  src="https://bizweb.dktcdn.net/100/114/864/products/pn59il.jpg?v=1603329247773" alt="My Marker" className=" w-6 h-6 cursor-pointer hover:border-pink-700 border-2  border-red-500" />
                    </Marker>
                }

                {
                    to &&
                    <Marker
                        latitude={to.latitude}
                        longitude={to.longitude}
                        // get event when click on
                        // @ts-ignore
                        // onClick={handleMarkerClick}
                        // @ts-ignore
                        anchor="bottom"
                        offsetTop={-20}
                        offsetLeft={-10}
                        mapStyle="mapbox://styles/mapbox/streets-v9"
                    >
                        <img src="https://bizweb.dktcdn.net/100/114/864/products/pn59il.jpg?v=1603329247773" alt="My Marker" className=" w-6 h-6 cursor-pointer hover:border-pink-700 border-2 border-red-500" />
                    </Marker>
                }
                {routeFeature && (<Source id="route" type="geojson" data={routeFeature}>
                    <Layer

                        id="route"
                        type="line"
                        source="route"
                        layout={{
                            "line-join": "round",
                            "line-cap": "round"
                        }}
                        paint={{
                            "line-color": "red",
                            "line-width": 1
                        }}
                    />
                </Source>
                )}

            </ReactMapGL>
            <div className="w-full mt-4 flex flex-col">
                {
                    startPoint ?
                        <span className="font-semibold text-sm">Start Point: longitude {startPoint.longitude} latitude {startPoint.latitude} Street Name: {startPoint.name?startPoint.name:""}</span>
                        :
                        <span className="font-semibold text-sm">Start Point: nothing</span>
                }
                {
                    endPoint ?
                        <span className="font-semibold text-sm">End Point: longitude {endPoint.longitude} latitude {endPoint.latitude} Street Name: {endPoint.name?endPoint.name:""}</span>
                        :
                        <span className="font-semibold text-sm">End Point: nothing</span>
                }
                {
                    !routeFeature ?
                    <button onClick={handleFind} className="p-2 my-2 w-24 rounded-md bg-pink-300 hover:bg-pink-400">
                        <span className="text-white font-semibold text-sm">
                            Find
                        </span>
                    </button>
                    :
                    <button onClick={handleMove} className="p-2 my-2 w-24 rounded-md bg-pink-300 hover:bg-pink-400">
                        <span className="text-white font-semibold text-sm">
                            Move
                        </span>
                    </button>

                }
            </div>
        </>
    );
};

export default TestGraph;
