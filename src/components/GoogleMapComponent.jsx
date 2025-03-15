import { GoogleMap, Marker, DirectionsRenderer, useJsApiLoader } from "@react-google-maps/api";
import { useState, useEffect, useCallback } from "react";

const containerStyle = { width: "100%", height: "500px" };
const googleMapsApiKey = "AIzaSyCOzIzaIB2p5SmOhThLVrgYjkyfxUxM4-M"; // Replace with your actual API key

export default function GoogleMapComponent({ latitude, longitude, destination, onLocationChange }) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: googleMapsApiKey,
    libraries: ["places"], // Enable Places API
  });

  const [directions, setDirections] = useState(null);
  const [mechanics, setMechanics] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState({ lat: latitude, lng: longitude });

  // Fetch nearby mechanics
  useEffect(() => {
    if (isLoaded) {
      const service = new window.google.maps.places.PlacesService(document.createElement("div"));
      service.nearbySearch(
        {
          location: { lat: latitude, lng: longitude },
          radius: 5000, // 5km radius
          type: "car_repair",
        },
        (results, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            setMechanics(results);
          } else {
            console.error("Error fetching mechanics:", status);
          }
        }
      );
    }
  }, [isLoaded, latitude, longitude]);

  // Get directions
  useEffect(() => {
    if (isLoaded && destination) {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: { lat: latitude, lng: longitude },
          destination: { lat: destination.lat, lng: destination.lng },
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirections(result);
          } else {
            console.error("Error fetching directions:", status);
          }
        }
      );
    }
  }, [isLoaded, destination, latitude, longitude]);

  // Handle marker drag event
  const onMarkerDragEnd = useCallback((event) => {
    const newLocation = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };
    setSelectedLocation(newLocation);
    onLocationChange(newLocation); // Send new location to parent component
  }, [onLocationChange]);

  if (!isLoaded) return <p>Loading Map...</p>;

  return (
    <GoogleMap center={selectedLocation} zoom={15} mapContainerStyle={containerStyle}>
      {/* Movable Marker for User Location */}
      <Marker
        position={selectedLocation}
        draggable={true}
        onDragEnd={onMarkerDragEnd}
        label="📍"
      />

      {/* Destination Marker */}
      {destination && <Marker position={destination} label="C" />}

      {/* Mechanics Markers */}
      {mechanics.map((mechanic, index) => (
        <Marker
          key={index}
          position={mechanic.geometry.location}
          label="🔧"
          title={mechanic.name}
        />
      ))}

      {/* Directions Renderer */}
      {directions && <DirectionsRenderer directions={directions} />}
    </GoogleMap>
  );
}
