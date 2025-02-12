"use client";
import Image from "next/image";
import Link from "next/link";

export const Logo = () => {
  return (
    <Link
      href="/"
      className="flex items-center gap-4 hover:opacity-90 transition duration-300 ease-in-out"
    >
      <div className="relative w-14 h-14">
        <Image
          src="/img/logo.png"
          alt="MANIT Logo"
          fill
          className="object-contain"
        />
      </div>
      <div className="flex flex-col leading-snug">
        <h1 className="text-xl font-black text-[#0A1F44] tracking-wide">MANIT</h1>
        <span className="text-sm font-extrabold text-[#06142E] tracking-tight">
          T&P CELL
        </span>
      </div>
    </Link>
  );
};
