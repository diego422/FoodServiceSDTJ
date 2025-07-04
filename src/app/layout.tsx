import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Sidebar from "./ui/nav/Sidebar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FoodService STDJ",
  description: "Sistema de gestión de inventario",
};


/**
 * RootLayout Component:
 *
 * This is the top-level layout that wraps all pages.
 *
 * Props:
 * - children: The page content that will be rendered inside the layout.
 *
 * Functionality:
 * - Sets the language of the HTML page to English.
 * - Applies the custom fonts via CSS variables.
 * - Renders the Sidebar on all pages.
 * - Places the main page content to the right of the sidebar.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Sidebar fixed */}
        <Sidebar />

        {/* Main shifted to the right */}
        <main className="ml-64 p-6 transition-all duration-300">
          {children}
        </main>
      </body>
    </html>
  );
}
