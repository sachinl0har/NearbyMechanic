import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function Home() {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          setUserRole(userDoc.data().role);
        }
      } else {
        setUserRole(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleGetStarted = () => {
    if (user) {
      if (userRole === "customer") {
        navigate("/dashboard");
      } else if (userRole === "mechanic") {
        navigate("/mechanic");
      }
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="text-center p-10">
      <h1 className="text-4xl font-bold mb-4">Nearby Mechanic Call App</h1>
      <p className="text-gray-600 mb-6">Find and call mechanics nearby quickly.</p>
      <button
        onClick={handleGetStarted}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Get Started
      </button>
    </div>
  );
}
