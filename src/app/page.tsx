"use client";

import { useEffect, useState } from "react";
import { getOpenBoxForToday, openBoxStoredProcedure } from "@/lib/actions";

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [initialAmount, setInitialAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkBoxStatus() {
      const openBox = await getOpenBoxForToday();
      if (!openBox) {
        setShowModal(true);
      }
      setIsLoading(false);
    }
    checkBoxStatus();
  }, []);

  const handleOpenBox = async () => {
    await openBoxStoredProcedure(initialAmount);
    setShowModal(false);
  };

  if (isLoading) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-white p-8">
      <main className="bg-white p-10 rounded-xl shadow-lg max-w-xl w-full text-center animate-fade-in">
        <img
          src="/Logo_FoodService.png"
          alt="Logo Food Service"
          className="w-20 h-20 mx-auto mb-4 rounded-full shadow"
        />
        <h1 className="text-3xl font-bold text-emerald-700 mb-4">
          Bienvenido al sistema
        </h1>
        <p className="text-gray-700 mb-6">
          Usá el menú para navegar.
        </p>
        <p className="text-gray-600 mb-4">
          <strong>Soda Maggie</strong> es un sistema de gestión diseñado para
          facilitar el control y la administración de tu negocio.
        </p>
        <ul className="text-gray-600 text-left mx-auto max-w-md list-disc list-inside">
          <li>Gestionar categorías y productos.</li>
          <li>Controlar ingredientes y stock.</li>
          <li>Registrar y supervisar pedidos.</li>
          <li>Generar reportes detallados de ventas.</li>
          <li>Realizar el cierre diario de caja.</li>
        </ul>
        <p className="text-gray-600 mt-4">
          ¡Optimizá tus procesos y llevá el control total de tu soda!
        </p>
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Apertura de Caja</h2>
            <p className="mb-2">Ingrese el monto inicial del día:</p>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              className="w-full border border-gray-300 p-2 rounded mb-4"
              value={initialAmount === 0 ? "" : initialAmount}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*$/.test(value)) {
                  setInitialAmount(Number(value));
                }
              }}
              placeholder="₡ Monto inicial"
            />
            <div className="flex justify-end gap-2">
              <button
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded"
                onClick={handleOpenBox}
              >
                Abrir Caja
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
