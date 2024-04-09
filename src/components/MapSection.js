import { useState, useCallback, useEffect } from "react";
import {
  GoogleMap,
  MarkerF,
  OverlayViewF,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { useTrip } from "@/context/TripContext/TripContext"; // Ensure this path is correct
import { useFrom } from "@/context/LocationContext/user/FromContext";
import { useDestination } from "@/context/LocationContext/user/DestinationContext";
import { useDriverDestination } from "@/context/LocationContext/driver/DriverDestinationContext";
import { useDriverFrom } from "@/context/LocationContext/driver/DriverFromContext";
import { useSocket } from "@/context/SocketContext/SocketContext";


const containerStyle = {
  width: "100%",
  height: "100vh",
};

export default function MapSection({ isDriver }) {
  const { activeRide } = useSocket();
  const { driverSource } = useDriverFrom();
  const { driverDestination } = useDriverDestination();
  const { source: userSource } = useFrom();
  const { destination: userDestination } = useDestination();

  
  const [map, setMap] = useState(null);
  

  
//   const { source: userSource } = useFrom();
//   const { destination: userDestination } = useDestination();
//   const { driverSource } = useDriverFrom();
//   const { driverDestination } = useDriverDestination();

//   const {  riderDestination } = useTrip();

//   // Initial source and destination are based on user or driver context
//   // const [activeSource, setActiveSource] = useState(isDriver ? driverSource : userSource);
//   // const [activeDestination, setActiveDestination] = useState(userDestination);

//    // Determine which source and destination to use
//    const source = isDriver ? driverSource : userSource;
//    const destination = isDriver ? driverDestination : userDestination;

//   const [center, setCenter] = useState({ lat: 9.0764785, lng: 7.398574 }); // Default to Abuja center
//   const [map, setMap] = useState(null);
//   const [directionsResult, setDirectionsResult] = useState(null);

//   // Update directions when source or destination changes
//   const calculateRoute = useCallback(() => {
//     if (!source || !destination || !window.google) return;

//     const DirectionsService = new window.google.maps.DirectionsService();

//     DirectionsService.route(
//       {
//         origin: new window.google.maps.LatLng(source.lat, source.lng),
//         destination: new window.google.maps.LatLng(destination.lat, destination.lng),
//         travelMode: window.google.maps.TravelMode.DRIVING,
//       },
//       (result, status) => {
//         if (status === window.google.maps.DirectionsStatus.OK) {
//           setDirectionsResult(result);
//         } else {
//           console.error(`error fetching directions ${result}`);
//         }
//       }
//     );
//   }, [source, destination]);

//   useEffect(() => {
//     console.log('isDriver:', isDriver);
//     console.log('Source:', source);
//     console.log('Destination:', destination);
//     calculateRoute();
// }, [isDriver, source, destination, calculateRoute]);


//   useEffect(() => {
//     calculateRoute();
//   }, [calculateRoute]);

//   useEffect(() => {
//     if (source) {
//       setCenter({ lat: source.lat, lng: source.lng });
//     }
//   }, [source]);

//   useEffect(() => {
//     if (destination && map) {
//       setCenter({
//         lat: destination.lat,
//         lng: destination.lng,
//       });
//     }
//     // Call directionRoute again to ensure destination changes trigger route calculation
//     calculateRoute();
//   }, [destination, calculateRoute, map]);

//   console.log(directionsResult);


//   const onLoad = useCallback(function callback(map) {
//     const bounds = new window.google.maps.LatLngBounds(center);
//     map.fitBounds(bounds);
//     setMap(map);
//   }, [center]);

//   const onUnmount = useCallback(function callback(map) {
//     setMap(null);
//   }, []);

const { socket, activeRide: socketActiveRide } = useSocket(); // Use this if activeRide is not passed as a prop and you want to fetch it directly from SocketContext
  const ride = activeRide || socketActiveRide; // Use passed activeRide or fetch from context

 // Define source and destination based on activeRide or driver/user context
 const source = activeRide ? activeRide.driverLocation : (isDriver ? driverSource : userSource);
 const destination = activeRide ? activeRide.riderDestination : (isDriver ? driverDestination : userDestination);

  
  // const source = ride ? ride.driverLocation : (isDriver ? driverSource : userSource);
  // const destination = ride ? ride.riderDestination : (isDriver ? driverDestination : userDestination);

  const [center, setCenter] = useState({ lat: 9.0764785, lng: 7.398574 });
  const [directionsResult, setDirectionsResult] = useState(null);

  const calculateRoute = useCallback(() => {
    if (!source || !destination || !window.google) return;

    const DirectionsService = new window.google.maps.DirectionsService();

    DirectionsService.route({
      // origin: new window.google.maps.LatLng(source.lat, source.lng),
      // destination: new window.google.maps.LatLng(destination.lat, destination.lng),
      origin: source,
      destination: destination,
      travelMode: window.google.maps.TravelMode.DRIVING,
    }, (result, status) => {
      if (status === window.google.maps.DirectionsStatus.OK) {
        setDirectionsResult(result);
      } else {
        console.error(`Error fetching directions ${result}`);
      }
    });
  }, [source, destination]);

  // useEffect(() => {
  //   calculateRoute();
  // }, [calculateRoute]);

  useEffect(() => {
    if (activeRide) {
      // Use activeRide locations
      calculateRoute(activeRide.driverLocation, activeRide.riderDestination);
    } else {
      // Use context locations (driver or user)
      const currentSource = isDriver ? driverSource : userSource;
      const currentDestination = isDriver ? driverDestination : userDestination;
      if (currentSource && currentDestination) {
        calculateRoute(currentSource, currentDestination);
      }
    }
  }, [activeRide, isDriver, userSource, userDestination, driverSource, driverDestination]);

  // useEffect(() => {
  //   if (source) {
  //     setCenter({ lat: source.lat, lng: source.lng });
  //   }
  // }, [source]);
  useEffect(() => {
    if (source) {
      setCenter(source);
    }
  }, [source]);

  useEffect(() => {
    if (destination && window.google) {
      calculateRoute();
    }
  }, [destination, calculateRoute]);

  const onLoad = useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);
    setMap(map);
  }, [center]);

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
      {/* Source Marker */}
      {source && (
        <MarkerF
          position={{ lat: source.lat, lng: source.lng }}
          icon={{
            url: "/assets/user-marker.svg",
            scaledSize: new window.google.maps.Size(40, 40),
          }}
        />
      )}

      {/* Destination Marker */}
      {destination && (
        <MarkerF
          position={{ lat: destination.lat, lng: destination.lng }}
          icon={{
            url: "/assets/location-marker.svg",
            scaledSize: new window.google.maps.Size(30, 30),
          }}
        />
      )}

      {/* Directions Renderer */}
      {directionsResult && (
        <DirectionsRenderer
          directions={directionsResult}
          options={{
            suppressMarkers: true, // Suppress default markers
            polylineOptions: { strokeColor: "#000" },
          }}
        />
      )}
    </GoogleMap>
  );
}
