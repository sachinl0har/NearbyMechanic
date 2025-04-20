import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase"; // ⬅️ also import db
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore"; // ⬅️ import Firestore methods

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Fetch role from Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const { role } = userDocSnap.data();

        // Redirect based on role
        if (role === "customer") {
          navigate("/dashboard");
        } else if (role === "mechanic") {
          navigate("/mechanic");
        } else {
          alert("Unknown user role");
        }
      } else {
        alert("User data not found in Firestore");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <form className="bg-white p-6 rounded shadow-md" onSubmit={handleLogin}>
        <h2 className="text-xl font-bold">Login</h2>
        <input
          className="w-full p-2 border rounded mt-2"
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full p-2 border rounded mt-2"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="w-full bg-blue-500 text-white p-2 mt-4 rounded">Login</button>
      </form>
    </div>
  );
}
