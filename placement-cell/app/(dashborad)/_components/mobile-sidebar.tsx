"use client";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetHeader,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Sidebar } from "./sidebar";

export const MobileSideBar = () => {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden p-2 hover:bg-blue-100 transition duration-200">
        <Menu className="h-6 w-6 text-blue-800" /> {/* Darker blue icon */}
      </SheetTrigger>

      <SheetContent className="bg-white p-0 border-r-2 border-blue-300 shadow-md" side="left">
        <SheetHeader>
          {/* Accessible Title for Screen Readers Only */}
          <SheetTitle className="sr-only">MANIT Placement Cell Navigation</SheetTitle>
        </SheetHeader>

        <Sidebar />
      </SheetContent>
    </Sheet>
  );
};
