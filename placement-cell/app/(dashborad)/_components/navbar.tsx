import React from "react";
import { NavbarRoutes } from "./navbar-routes";
import { MobileSideBar } from "./mobile-sidebar";

export const Navbar = () => {
  return (
    <div className="sticky top-0 z-50 p-4 border-b border-blue-300 bg-white shadow-md flex items-center justify-between">
      {/* Mobile Sidebar */}
      <MobileSideBar />

      {/* Navbar Routes */}
      <NavbarRoutes />
    </div>
  );
};
