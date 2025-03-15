import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer"); // Default role: Customer
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store user role in Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        role: role,
      });

      // Redirect based on role
      if (role === "customer") {
        navigate("/dashboard");
      } else {
        navigate("/mechanic");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <form className="bg-white p-6 rounded shadow-md" onSubmit={handleRegister}>
        <h2 className="text-xl font-bold">Register</h2>

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

        {/* Role Selection */}
        <div className="mt-3">
          <label className="mr-3">
            <input
              type="radio"
              value="customer"
              checked={role === "customer"}
              onChange={() => setRole("customer")}
            />{" "}
            Customer
          </label>
          <label>
            <input
              type="radio"
              value="mechanic"
              checked={role === "mechanic"}
              onChange={() => setRole("mechanic")}
            />{" "}
            Mechanic
          </label>
        </div>

        <button className="w-full bg-green-500 text-white p-2 mt-4 rounded">
          Register
        </button>
      </form>
    </div>
  );
}
