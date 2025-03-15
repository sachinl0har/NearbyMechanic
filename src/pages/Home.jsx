import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="text-center p-10">
      <h1 className="text-4xl font-bold mb-4">Nearby Mechanic Call App</h1>
      <p className="text-gray-600 mb-6">Find and call mechanics nearby quickly.</p>
      <Link to="/login" className="bg-blue-500 text-white px-4 py-2 rounded">
        Get Started
      </Link>
    </div>
  );
}
