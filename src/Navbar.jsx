import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <nav className="bg-gray-900 text-white w-full fixed top-0 left-0 shadow-md z-50">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold flex items-center">
          🚗 <span className="ml-2">Mechanic Finder</span>
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden focus:outline-none text-xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✖" : "☰"}
        </button>

        {/* Navigation Links */}
        <ul
          className={`flex flex-col md:flex-row md:space-x-6 md:items-center md:static fixed top-16 left-0 w-full md:w-auto bg-gray-900 md:bg-transparent p-4 md:p-0 transition-all duration-300 ease-in-out ${
            menuOpen ? "flex" : "hidden"
          } md:flex`}
        >
          <li>
            <Link to="/" className="hover:text-yellow-400 block md:inline p-2">
              Home
            </Link>
          </li>

          {user ? (
            <>
              <li className="font-semibold text-green-400 block md:inline p-2">
                👤 {user.displayName || "User"}
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-yellow-400 block md:inline p-2">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/mechanic" className="hover:text-yellow-400 block md:inline p-2">
                  Mechanic
                </Link>
              </li>
              <li>
                <button
                  className="bg-red-500 hover:bg-red-700 px-3 py-1 rounded block md:inline"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className="hover:text-yellow-400 block md:inline p-2">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-yellow-400 block md:inline p-2">
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
