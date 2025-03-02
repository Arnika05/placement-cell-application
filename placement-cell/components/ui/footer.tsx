"use client";

import { Logo } from "@/app/(dashborad)/_components/logo";
import { Linkedin, Mail } from "lucide-react";
import Link from "next/link";

const menuOne = [
  { href: "#", label: "About Us" },
  { href: "#", label: "Careers" },
  { href: "#", label: "Employer Home" },
  { href: "#", label: "Sitemap" },
  { href: "#", label: "Credits" },
];

export const Footer = () => {
  return (
    <div className="bg-gray-100 p-6 rounded-t-lg w-full">
      <div className="w-full flex flex-wrap justify-between items-center gap-6">
        {/* Branding */}
        <div className="flex items-center gap-3">
          <Logo />
        </div>

        {/* Menu Links */}
        <div className="flex gap-6">
          {menuOne.map((item) => (
            <Link key={item.label} href={item.href}>
              <p className="text-sm text-gray-600 hover:text-blue-600 transition">{item.label}</p>
            </Link>
          ))}
        </div>

        {/* Social Links */}
        <div className="flex items-center gap-4">
          <Link href="https://www.linkedin.com/company/tpo-manit/" target="_blank" rel="noopener noreferrer">
            <Linkedin className="w-6 h-6 text-gray-600 hover:text-blue-600 hover:scale-110 transition-all" />
          </Link>
          <Link href="mailto:tpwnitb@gmail.com">
            <Mail className="w-6 h-6 text-gray-600 hover:text-blue-600 hover:scale-110 transition-all" />
          </Link>
        </div>
      </div>

      {/* Bottom Separator & Copyright */}
      <hr className="mt-4 border-gray-300" />
      <div className="text-center text-sm text-gray-600 mt-2">© 2025 All rights reserved</div>
    </div>
  );
};
