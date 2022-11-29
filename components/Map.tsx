import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import Image from "next/image";
import { useMemo, useState } from "react";
import mapStyles from "../styles/mapStyles";

export default function Map({restaurants}) {

  const center = useMemo(() => ({ lat: 46.5158954, lng: -0.3509244 }), []); //deux-sevres
  const [selectedMarker, SetSelectedMarker] = useState(null);
  const [infoWindowTitre, SetInfoWindowTitre] = useState(null);
  const [infoWindowImg, SetInfoWindowImg] = useState(null);

  const onLoad = (infoWindow) => {
    console.log("infoWindow: ", infoWindow);
  };

  const divStyle = {
    background: `white`,
  };

  const setInfosWindow = (index: number) => {
    SetSelectedMarker({
      lat: restaurants[index].data().lat,
      lng: restaurants[index].data().lng,
    });
    SetInfoWindowImg(restaurants[index].data().image);
    SetInfoWindowTitre(restaurants[index].data().title);
  };

  const svgMarker = {
    path: "M10.453 14.016l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
    fillColor: "blue",
    fillOpacity: 0.8,
    strokeWeight: 0,
    rotation: 0,
    scale: 2,
    // anchor: new google.maps.Point(15, 30),
  };

  return (
    <GoogleMap
      zoom={9}
      center={center}
      mapContainerClassName="map-container"
      options={{ styles: mapStyles }}
    >
      {restaurants.map((restaurant, index) => {
        return (
          <Marker
            key={index}
            position={{
              lat: restaurant.data().lat,
              lng: restaurant.data().lng,
            }}
            title={restaurant.data().title}
            animation={google.maps.Animation.DROP}
            onClick={() => setInfosWindow(index)}
            icon={svgMarker}
          />
        );
      })}
      {selectedMarker && (
        <InfoWindow
          onLoad={onLoad}
          position={selectedMarker}
          onCloseClick={() => SetSelectedMarker(null)}
        >
          <div style={divStyle}>
            <Image src={infoWindowImg} 
              width={"150"} 
              height={"100"} 
              alt="" 
            />
            <h1 className="text-sm font-semibold p-1"> {infoWindowTitre}</h1>
          </div>
        </InfoWindow>
      )}
      ;
    </GoogleMap>
  );
}
