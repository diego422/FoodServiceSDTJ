"use client";

/**
 * Sidebar.tsx
 *
 * This is a Client Component in Next.js.
 *
 * ▸ Purpose:
 * - Displays a collapsible sidebar on the left side of the app.
 * - Provides navigation links to different pages of the dashboard.
 * - Highlights the active page for better user orientation.
 * - Contains icons for each menu item for better UX.
 */

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import Image from "next/image";


/**
 * List of menu items displayed in the sidebar.
 * Each item has:
 * - label: text shown beside the icon.
 * - href: URL to navigate to.
 * - icon: path to an icon image file.
 */
const menuItems = [
  { label: "Inicio", href: "/", icon: "/BoxIcon.png" },
  { label: "Gestión Categorias", href: "/dashboard/categorias/inicio", icon: "/Category_tags_icon 1.png" },
  { label: "Gestión Productos", href: "/dashboard/productos/inicio", icon: "/ProductIcon.png" },
  { label: "Gestión Ingredientes", href: "/dashboard/ingredientes/inicio", icon: "/IngredientIcon.png" },
  { label: "Gestión Pedidos", href: "/dashboard/pedidos/inicio", icon: "/OrdersIcon.png" },
  { label: "Gestión Reportes", href: "/dashboard/Reporte/inicio", icon: "/ReportIcon.png" },
  { label: "Cierre de caja", href: "/dashboard/cierreCaja/inicio", icon: "/BoxIcon.png" },
];


/**
 * Sidebar Component
 *
 * This renders a fixed vertical navigation bar.
 *
 * Features:
 * - Can expand and collapse to save screen space.
 * - Highlights the current page based on the URL.
 * - Uses Heroicons and Next.js Image optimization.
 */
export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();

  return (
    <div
      className={`
        fixed top-0 left-0 h-screen
        bg-gray-800 text-white
        transition-all duration-300
        ${isOpen ? "w-64" : "w-32"}
        flex flex-col justify-between
        z-50
      `}
    >
      {/* Header */}
      <div>
        <div className="flex items-center justify-between px-4 py-4 bg-gray-900">
          <Image
            src="/logo_FoodService.png"
            alt="Logo"
            width={70}
            height={70}
            className="rounded"
          />
          <span
            className={`text-2xl font-bold text-[#0DBC7C] ${isOpen ? "block" : "hidden"
              }`}
          >

            FoodService SDTJ
          </span>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="focus:outline-none"
          >
            {isOpen ? (
              <ChevronLeftIcon className="w-5 h-5 text-green-400" />
            ) : (
              <ChevronRightIcon className="w-5 h-5 text-green-400" />
            )}
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto mt-6">
          <nav className="flex-1 overflow-y-auto mt-6">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-3 rounded font-medium mx-2 mb-2 transition-colors duration-200 ${pathname === item.href
                    ? "bg-[#0DBC7C] text-white"
                    : "bg-green-100 text-black hover:bg-green-200"
                  }`}
              >
                {item.icon && (
                  <Image
                    src={item.icon}
                    alt="icon"
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                )}
                {isOpen && <span>{item.label}</span>}
              </Link>
            ))}
          </nav>

        </nav>
      </div>

      {/* Footer or future buttons */}
      <div className="mb-4 ml-4">{/* Space for future content */}</div>
    </div>
  );
}
