import Navbar from "../Navbar";
import { Outlet } from "react-router-dom";

export default function Layout() {
    return (
      <>
        <Navbar />
        <div className="mt-16 w-full h-full"> {/* Add margin-top to prevent overlap */}
          <Outlet />
        </div>
      </>
    );
  }
  
