// LocationAutocomplete.js
import { useState } from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { useFrom } from "@/context/LocationContext/user/FromContext";
import { useDestination } from "@/context/LocationContext/user/DestinationContext";
import { useDriverFrom } from "@/context/LocationContext/driver/DriverFromContext";
import { useDriverDestination } from "@/context/LocationContext/driver/DriverDestinationContext";

const LocationInput = ({ label, value, onChange, placeholder, type }) => {
  // Use context hooks to get setters
  const { setSource } = useFrom();
  const { setDestination } = useDestination();
  const { setDriverSource } = useDriverFrom();
  const { setDriverDestination } = useDriverDestination();

  let setContextFunction;

  if (type === "source") {
    setContextFunction = setSource;
  } else if (type === "driverSource") {
    setContextFunction = setDriverSource;
  } else if (type === "destination") {
    setContextFunction = setDestination;
  } else if (type === "driverDestination") {
    setContextFunction = setDriverDestination;
  }

  const getLatAndLng = (place) => {
    console.log("result", place, type);

    const placeId = place.value.place_id;
    const service = new google.maps.places.PlacesService(
      document.createElement("div")
    );

    service.getDetails({ placeId }, (placeDetails, status) => {
      if (
        status === "OK" &&
        placeDetails.geometry &&
        placeDetails.geometry.location
      ) {
        const locationData = {
          lat: placeDetails.geometry.location.lat(),
          lng: placeDetails.geometry.location.lng(),
          name: placeDetails.formatted_address,
          label: placeDetails.name,
        };

        console.log("getLatAndLng called with place:", place);
        console.log("Place details retrieved:", placeDetails);
        console.log("Attempting to update driverSource with:", locationData);
        

        console.log("from location input:", locationData);

        console.log("Updating context with:", locationData);


        setContextFunction(locationData);
      }
    });
  };
  return (
    <div className="flex flex-col gap-2 items-start border-b border-[#7E7E7E] pb-3">
      <p className="text-xs text-[#7E7E7E]">{label}</p>
      <GooglePlacesAutocomplete
        // apiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY}
        selectProps={{
          // value,
          onChange: (place) => getLatAndLng(place),
          placeholder,
          isClearable: true,
          className: "w-full",
          components: {
            DropdownIndicator: false,
          },
          styles: {
            control: (provided) => ({
              ...provided,
              backgroundColor: "transparent",
              border: "none",
              outline: "none",
            }),
          },
        }}
      />

    </div>
  );
};

export default LocationInput;
