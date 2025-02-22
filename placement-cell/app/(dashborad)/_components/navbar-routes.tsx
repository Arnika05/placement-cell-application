"use client";

import { SearchContainer } from "@/components/search-container";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { LogOut, Shield } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const NavbarRoutes = () => {
  const pathname = usePathname();

  const isAdminPage = pathname?.startsWith("/admin");
  const isClientPage = pathname?.startsWith("/jobs");
  const isSearchPage = pathname?.startsWith("/search"); 

  return (
    <>
    {isSearchPage && (
      <div className="hidden md:flex w-full px-2 pr-8 items-center gap-x-6">
        <SearchContainer />
      </div>
    )}
    <div className="flex gap-x-2 ml-auto items-center"> {/* Reduced gap */}
      {/* Conditional Button for Admin/Client Pages */}
      {isAdminPage || isClientPage ? (
        <Link href={"/"}>
          <Button
            variant="outline"
            size="sm"
            className="border border-blue-700 text-blue-700 hover:bg-blue-100 flex items-center gap-1 transition font-semibold px-3 py-1 rounded-md" // Added border and consistent font
          >
            <LogOut className="h-4 w-4" />
            Exit
          </Button>
        </Link>
      ) : (
        <Link href={"/admin/jobs"}>
          <Button
            variant="outline"
            size="sm"
            className="border border-blue-700 text-blue-700 hover:bg-blue-100 flex items-center gap-1 transition font-semibold px-3 py-1 rounded-md" // Added border and consistent font
          >
            <Shield className="h-4 w-4" />
            Admin Mode
          </Button>
        </Link>
      )}

      {/* User Profile Button */}
      <UserButton />

      {/* Consistent Sign Out Button
      <SignOutButton redirectUrl="/sign-in">
        <Button
          variant="outline"
          size="sm"
          className="border border-blue-700 text-blue-700 hover:bg-blue-100 flex items-center gap-1 transition font-semibold px-3 py-1 rounded-md" // Added border and consistent font
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </SignOutButton> */}
    </div>
    </>
  );
};
