import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, onSnapshot, serverTimestamp } from "firebase/firestore";
import GoogleMapComponent from "../components/GoogleMapComponent";

export default function CustomerDashboard() {
  const [location, setLocation] = useState({ lat: 0, lng: 0 });
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => setLocation({ lat: position.coords.latitude, lng: position.coords.longitude }),
      (error) => console.error("Error getting location:", error)
    );
  }, []);

  const handleLocationChange = (newLocation) => {
    setLocation(newLocation);
  };

  const callMechanic = async () => {
    await addDoc(collection(db, "customerRequests"), {
      location, // Send selected location
      status: "Pending",
      timestamp: serverTimestamp(),
    });

    alert("Mechanic has been notified!");
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "customerRequests"), (snapshot) => {
      const myRequests = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRequests(myRequests);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="w-full h-screen flex flex-col items-center">
      <h1 className="text-2xl mt-4">Find Nearby Mechanics</h1>
      <GoogleMapComponent latitude={location.lat} longitude={location.lng} onLocationChange={handleLocationChange} />
      <button
        onClick={callMechanic}
        className="mt-4 bg-red-500 text-white p-3 rounded"
      >
        Call Mechanic
      </button>

      <h2 className="mt-6 text-xl">Your Requests:</h2>
      <ul className="w-3/4 bg-gray-100 p-4 rounded shadow-md">
        {requests.length === 0 ? (
          <p>No requests yet</p>
        ) : (
          requests.map((request) => (
            <li key={request.id} className="p-2 border-b">
              📍 Location: {request.location.lat}, {request.location.lng} <br />
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
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
