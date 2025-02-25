"use client";

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

interface SidebarRouteItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
}

export const SidebarRouteItem = ({
  icon: Icon,
  label,
  href,
}: SidebarRouteItemProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const isActive =
    (pathname === "/" && href === "/") ||
    pathname === href ||
    pathname?.startsWith(`${href}/`);

  const handleClick = () => {
    router.push(href);
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "flex items-center gap-3 text-neutral-500 text-base font-medium py-3 rounded-lg transition-transform transform hover:scale-105 hover:bg-blue-100/40 focus:outline-none",
        isActive &&
          "bg-blue-500/10 text-blue-700 font-semibold shadow-md scale-105" // 🔵 Active route highlight
      )}
    >
      {/* Active Indicator Line */}
      <div
        className={cn(
          "w-1 h-8 bg-blue-700 rounded-full transition-all",
          isActive ? "opacity-100" : "opacity-0"
        )}
      ></div>

      {/* Icon and Label */}
      <div className="flex items-center gap-1">
        <Icon
          className={cn("text-neutral-500", isActive && "text-blue-700")} // Icon color on active
          size={22}
        />
        <span>{label}</span>
      </div>
    </button>
  );
};
