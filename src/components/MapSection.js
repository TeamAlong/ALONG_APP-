import { useState, useCallback, useEffect } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  MarkerF,
  OverlayView,
  OverlayViewF,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { useFrom } from "@/context/LocationContext/user/FromContext";
import { useDestination } from "@/context/LocationContext/user/DestinationContext";
import { useDriverFrom } from "@/context/LocationContext/driver/DriverFromContext";
import { useDriverDestination } from "@/context/LocationContext/driver/DriverDestinationContext";

const containerStyle = {
  width: "100%",
  height: "100vh",
  zoom: 0,
};

export default function MapSection({ isDriver = false }) {
  const { source: userSource } = useFrom();
  const { destination: userDestination } = useDestination();
  const { driverSource } = useDriverFrom();
  const { driverDestination } = useDriverDestination();

  // Determine which source and destination to use
  const source = isDriver ? driverSource : userSource;
  const destination = isDriver ? driverDestination : userDestination;

  const [center, setCenter] = useState({
    lat: -3.745,
    lng: -38.523,
  });
  const [map, setMap] = useState(null);
  const [directionsResult, setDirectionsResult] = useState(null);

  // Define directionRoute at the top level of the component
  const calculateRoute = useCallback(() => {
    if (!source || !destination || !window.google) return;

    const DirectionsService = new window.google.maps.DirectionsService();

    DirectionsService.route(
      {
        origin: new window.google.maps.LatLng(source.lat, source.lng),
        destination: new window.google.maps.LatLng(
          destination.lat,
          destination.lng
        ),
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirectionsResult(result);
        } else {
          console.error(`error fetching directions ${result}`);
        }
      }
    );
  }, [source, destination]);

  useEffect(() => {
    calculateRoute();
  }, [calculateRoute]);

  useEffect(() => {
    if (source) {
      setCenter({ lat: source.lat, lng: source.lng });
    }
  }, [source]);

  useEffect(() => {
    if (destination && map) {
      setCenter({
        lat: destination.lat,
        lng: destination.lng,
      });
    }
    // Call directionRoute again to ensure destination changes trigger route calculation
    calculateRoute();
  }, [destination, calculateRoute, map]);

  console.log(directionsResult);

  // useEffect(() => {
  //   // Attempt to fetch the user's current location
  //   if ("geolocation" in navigator) {
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         setCenter({
  //           lat: position.coords.latitude,
  //           lng: position.coords.longitude,
  //         });
  //       },
  //       (error) => {
  //         console.error("Error fetching geolocation: ", error);
  //       }
  //     );
  //   } else {
  //     console.log("Geolocation is not supported by this browser.");
  //   }
  // }, []);

  const onLoad = useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);

    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={10}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      {source && (
        <MarkerF
          position={{ lat: source.lat, lng: source.lng }}
          icon={{
            url: "/assets/user-marker.svg",
            scaledSize: {
              width: 40,
              height: 40,
            },
          }}
        >
          <OverlayViewF
            position={{ lat: source.lat, lng: source.lng }}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          >
            <div className="p-2 bg-white font-semibold inline-block">
              <p className="text-black text-xs">{source.label}</p>
            </div>
          </OverlayViewF>
        </MarkerF>
      )}

      {/* Destination marker */}
      {destination && (
        <MarkerF
          position={{ lat: destination.lat, lng: destination.lng }}
          icon={{
            url: "/assets/location-marker.svg",
            scaledSize: {
              width: 30,
              height: 30,
            },
          }}
        >
          <OverlayViewF
            position={{ lat: destination.lat, lng: destination.lng }}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          >
            <div className="p-2 bg-white font-semibold inline-block">
              <p className="text-black text-xs">{destination.label}</p>
            </div>
          </OverlayViewF>
        </MarkerF>
      )}
      {/* Child components, such as markers, info windows, etc. */}
      {/* <DirectionsRenderer directions={directionRoutePoints} options={{}} /> */}
      {directionsResult && (
        <DirectionsRenderer
          directions={directionsResult}
          options={{
            suppressMarkers: true,
            polylineOptions: { strokeColor: "#000" },
          }}
        />
      )}
    </GoogleMap>
  );
}
