import { memo, useState } from "react";
import ReactMapGL, { Marker, Source, Layer, Popup } from 'react-map-gl';
import xerac from '../../../assets/vehicles/xerac.jpg'

function TaskMap() {
    const [viewport, setViewport] = useState({
        height: 350,
        width: 550,
        latitude: 10.74427004016835,
        longitude: 106.65824255703593,
        name: "cao xuan duc",
        zoom: 15
    });
    const [vehiclePoint, setVehiclePoint] = useState<any>({
        latitude: 10.74427004016835,
        longitude: 106.65824255703593,
    })
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
            // onClick={() => setShowPopup(true)}
            >
                <img src={xerac} alt="My Marker" className=" w-10 h-10 cursor-pointer rounded-full hover:border-pink-700 border-2 border-red-500" />
            </Marker>
            {/* {showPopup && (
                <Popup
                    latitude={10.7600716401}
                    longitude={106.661927788}
                    closeButton={false}
                    anchor="top"
                    offsetTop={20}
                    offsetLeft={0}
                >
                    <div
                    className="h-[100px] w-[200px]"
                    >
                        {viewport.name}
                    </div>
                </Popup>
            )} */}
        </ReactMapGL>
    </>);
}

export default memo(TaskMap);