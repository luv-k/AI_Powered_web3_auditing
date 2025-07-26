"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");

      if (!token && window.location.pathname !== "/login") {
        router.push("/login");
      }
    }
  }, []);

  return (
    <html lang="en">
      <body className={`${inter.className} text-stone-950 bg-stone-100`}>
        {children}
      </body>
    </html>
  );
}
