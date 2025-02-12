import React from "react";
import { Logo } from "./logo";
import { SidebarRoutes } from "./sidebar-routes";

export const Sidebar = () => {
  return (
    <div className="h-full border-r border-blue-300 flex flex-col overflow-y-auto bg-white shadow-sm">
      {/* Logo Section */}
      <div className="p-4 flex justify-center items-center">
        <Logo />
      </div>

      {/* Sidebar Routes */}
      <div className="flex flex-col w-full p-4 space-y-4">
        <SidebarRoutes />
      </div>
    </div>
  );
};
