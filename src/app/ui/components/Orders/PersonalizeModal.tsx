"use client";

import { useEffect, useState } from "react";
import { Product, Ingrediente } from "@/lib/typesProducts";
import { getIngredientesPorProducto } from "@/lib/actions";

export default function PersonalizeModal({
  producto,
  onClose,
  onConfirm,
}: {
  producto: Product;
  onClose: () => void;
  onConfirm: (ingredientes: Ingrediente[]) => void;
}) {
  const [ingredientes, setIngredientes] = useState<Ingrediente[]>([]);

  useEffect(() => {
    async function fetchIngredientes() {
      const data = await getIngredientesPorProducto(producto.id);
      setIngredientes(
        data
          .sort((a, b) => a.nombre.localeCompare(b.nombre)) 
          .map((ing) => ({
            ...ing,
            checked: false,
          }))
      );
    }

    fetchIngredientes();
  }, [producto]);

  const toggleIngredient = (id: number) => {
    setIngredientes((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, checked: !i.checked } : i
      )
    );
  };

  const seleccionarTodos = () => {
    setIngredientes((prev) =>
      prev.map((i) => ({ ...i, checked: true }))
    );
  };

  const limpiarSeleccion = () => {
    setIngredientes((prev) =>
      prev.map((i) => ({ ...i, checked: false }))
    );
  };

  const handleAdd = () => {
    const algunoMarcado = ingredientes.some((i) => i.checked);
    if (!algunoMarcado) {
      alert("Debes seleccionar al menos un ingrediente.");
      return;
    }

    onConfirm(ingredientes);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded w-96 max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-bold mb-4">
          Personalizar: {producto.name}
        </h2>

        <div className="flex justify-between mb-4">
          <button
            onClick={seleccionarTodos}
            className="text-sm text-blue-600 hover:underline"
          >
            Seleccionar todos
          </button>
          <button
            onClick={limpiarSeleccion}
            className="text-sm text-red-600 hover:underline"
          >
            Limpiar selección
          </button>
        </div>

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
