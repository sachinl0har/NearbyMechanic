import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, doc, updateDoc, onSnapshot } from "firebase/firestore";
import GoogleMapComponent from "../components/GoogleMapComponent";

export default function MechanicDashboard() {
  const [location, setLocation] = useState({ lat: 0, lng: 0 });
  const [customerRequests, setCustomerRequests] = useState([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => setLocation({ lat: position.coords.latitude, lng: position.coords.longitude }),
      (error) => console.error("Error getting location:", error)
    );
  }, []);

  // Fetch customer requests in real time
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "customerRequests"), (snapshot) => {
      const requests = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCustomerRequests(requests);
    });

    return () => unsubscribe();
  }, []);

  // Redirect to Google Maps for route
  const openGoogleMaps = (requestLocation) => {
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${location.lat},${location.lng}&destination=${requestLocation.lat},${requestLocation.lng}&travelmode=driving`;
    window.open(googleMapsUrl, "_blank");
  };

  // Accept/Reject request
  const handleResponse = async (requestId, status, requestLocation) => {
    const requestRef = doc(db, "customerRequests", requestId);
    await updateDoc(requestRef, { status });

    if (status === "Accepted") {
      openGoogleMaps(requestLocation);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col items-center">
      <h1 className="text-2xl mt-4">Mechanic Dashboard</h1>

      {/* Google Map Component */}
      <GoogleMapComponent latitude={location.lat} longitude={location.lng} />

      <h2 className="mt-6 text-xl">Customer Requests:</h2>
      <ul className="w-3/4 bg-gray-100 p-4 rounded shadow-md">
        {customerRequests.length === 0 ? (
          <p>No requests yet</p>
        ) : (
          customerRequests.map((request) => (
            <li key={request.id} className="p-2 border-b">
              📍 Location: {request.location.lat}, {request.location.lng}
              <br />
              🚀 Status:{" "}
              <strong
                className={`${
                  request.status === "Accepted"
                    ? "text-green-600"
                    : request.status === "Rejected"
                    ? "text-red-600"
                    : "text-yellow-600"
                }`}
              >
                {request.status}
              </strong>

              {/* Show "Get Route" button always */}
              <button
                className="bg-blue-500 text-white px-3 py-1 rounded mt-2 mr-2"
                onClick={() => openGoogleMaps(request.location)}
              >
                Get Route
              </button>

              {/* Show Accept/Reject buttons only if status is Pending */}
              {request.status === "Pending" && (
                <div className="mt-2">
                  <button
                    className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                    onClick={() => handleResponse(request.id, "Accepted", request.location)}
                  >
                    Accept
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded"
                    onClick={() => handleResponse(request.id, "Rejected", request.location)}
                  >
                    Reject
                  </button>
                </div>
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
