import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Button } from "@/components/ui/button";
import { ClerkProvider } from "@clerk/nextjs";
import { ToastProvider } from "@/provider/toast-provider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"]
});

export const metadata: Metadata = {
  title: "Placement Cell App",
  description: "Placement Cell Application for MANIT Bhopal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body
        className={`${poppins.className} `}
      >
        {children}
        <ToastProvider />
      </body>
    </html>
    </ClerkProvider>
  );
}
