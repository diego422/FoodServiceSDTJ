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
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="text-3xl font-bold">Bienvenido al sistema</h1>
        <p className="text-lg">Usá el menú para navegar</p>
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