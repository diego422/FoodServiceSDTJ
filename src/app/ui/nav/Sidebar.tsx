"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const menuItems = [
  { label: "Gestión Categorias", href: "/dashboard/categorias/inicio" },
  { label: "Gestión Productos", href: "/dashboard/productos/inicio" },
  { label: "Gestión Ingredientes", href: "/dashboard/ingredientes/inicio" },
  { label: "Gestión Pedidos", href: "/dashboard/pedidos/inicio" },
  { label: "Gestión Reportes", href: "/dashboard/Reporte/inicio" },
  { label: "Cierre de caja", href: "/dashboard/roles" },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();

  return (
    <div
      className={`
        fixed top-0 left-0 h-screen
        bg-gray-800 text-white
        transition-all duration-300
        ${isOpen ? "w-64" : "w-16"}
        flex flex-col justify-between
        z-50
      `}
    >
      {/* Header */}
      <div>
        <div className="flex items-center justify-between px-4 py-4 bg-gray-900">
          <span
            className={`text-2xl font-bold text-green-400 ${
              isOpen ? "block" : "hidden"
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
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-4 py-3 rounded text-center font-medium mx-2 mb-2 transition-colors duration-200 ${
                pathname === item.href
                  ? "bg-green-400 text-white"
                  : "bg-green-100 text-black hover:bg-green-200"
              }`}
            >
              {isOpen ? item.label : item.label[0]}
            </Link>
          ))}
        </nav>
      </div>

      {/* Footer or future buttons */}
      <div className="mb-4 ml-4">{/* Space for future content */}</div>
    </div>
  );
}
