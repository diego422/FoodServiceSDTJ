"use client";

import { useEffect, useState } from "react";
import { Product, Ingrediente } from "@/lib/typesProducts";

export default function PersonalizeModal({
  producto,
  onClose,
}: {
  producto: Product;
  onClose: () => void;
}) {
  const [ingredientes, setIngredientes] = useState<Ingrediente[]>([]);

  useEffect(() => {
    // esto se tiene que cambiar, ya que es una simulación de datos
    setIngredientes([
      { id: 1, nombre: "Pan", checked: true },
      { id: 2, nombre: "Carne", checked: true },
      { id: 3, nombre: "Lechuga", checked: true },
    ]);
  }, [producto]);

  const toggleIngredient = (id: number) => {
    setIngredientes((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, checked: !i.checked } : i
      )
    );
  };

  const handleAdd = () => {
    console.log("Ingredientes seleccionados:", ingredientes);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded w-96">
        <h2 className="text-lg font-bold mb-4">
          Personalizar: {producto.name}
        </h2>

        {ingredientes.map((ing) => (
          <div
            key={ing.id}
            className="flex justify-between items-center bg-gray-200 p-2 rounded mb-2"
          >
            <span>{ing.nombre}</span>
            <input
              type="checkbox"
              checked={ing.checked}
              onChange={() => toggleIngredient(ing.id)}
            />
          </div>
        ))}

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancelar
          </button>
          <button
            onClick={handleAdd}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded"
          >
            Añadir a la orden
          </button>
        </div>
      </div>
    </div>
  );
}
