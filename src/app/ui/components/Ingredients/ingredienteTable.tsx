/**
 * This is the component for a ingredient, the IngredienteTable.
 * 
 * Displays a table of ingredients with options to edit or inactivate each ingredient.
 * - Provides a modal to modify ingredient name, quantity, and unit of measurement.
 * - Allows inactivating ingredients via an async server action.
 */

"use client";

import { useState, useTransition } from "react";
import { updateIngrediente, inactivateIngredient } from "@/lib/actions";
import { useRouter } from "next/navigation";

type Ingrediente = {
  codigoIngrediente: number;
  nombreUnidadMedida: string;
  nombre: string;
  cantidad: string;
};

type UnidadMedida = {
  id: number;
  nombre: string;
};

interface Props {
  data: Ingrediente[];
  unidades: UnidadMedida[];
}
/**
 * This function is the responsible for renders a table of ingredients with edit and inactivate options.
 * @param param0 
 * @returns The rendered table and the modal in (if Open).
 */
export default function IngredienteTable({ data, unidades }: Props) {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [editingIng, setEditingIng] = useState<Ingrediente | null>(null);
  const [newName, setNewName] = useState("");
  const [newUnidad, setNewUnidad] = useState("");
  const [newCantidad, setNewCantidad] = useState("");
  const [isPending, startTransition] = useTransition();

  const openModal = (ingrediente: Ingrediente) => {
    setEditingIng(ingrediente);
    setNewName(ingrediente.nombre);
    setNewUnidad(ingrediente.nombreUnidadMedida);
    setNewCantidad(ingrediente.cantidad);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setEditingIng(null);
    setNewName("");
    setNewUnidad("");
    setNewCantidad("");
  };

  const handleSave = () => {
    if (!editingIng) return;

     const cantidadNum = parseFloat(newCantidad);

      if (isNaN(cantidadNum) || cantidadNum < 0) {
    alert("La cantidad no puede ser negativa.");
    return;
  }

  if (newName == ""){
    alert("El nombre no puede estar vacio.");
    return
  }

  if (!newUnidad.trim()) {
    alert("Se debe elegir una nueva unidad de medida");
    return
  }

    startTransition(async () => {
      await updateIngrediente(
        editingIng.codigoIngrediente,
        newName,
        newUnidad,
        cantidadNum
      );
      closeModal();
      router.refresh();
    });
  };

  const handleInactivate = async (ing: Ingrediente) => {
    const response = inactivateIngredient(ing.codigoIngrediente);
    if ((await response).success) {
      alert("Ingrediente inactivado correctamente.");
      router.refresh();
    } else {
      alert("Error al inactivar el ingrediente.");
    }
  };

  return (
    <>
      {/* Tabla */}
      <table className="min-w-full text-sm mt-4">
        <thead className="bg-gray-800 text-white uppercase text-xs font-semibold">
          <tr>
            <th className="px-4 py-2 text-left">Código Ingrediente</th>
            <th className="px-4 py-2 text-left">Unidad de medida</th>
            <th className="px-4 py-2 text-left">Nombre</th>
            <th className="px-4 py-2 text-left">Cantidad</th>
            <th className="px-4 py-2 text-left">Modificar</th>
            <th className="px-4 py-2 text-left">Inactivar</th>
          </tr>
        </thead>
        <tbody>
          {data.map((ing) => (
            <tr
              key={ing.codigoIngrediente}
              className="odd:bg-gray-900 even:bg-gray-800 text-white"
            >
              <td className="px-4 py-2">{ing.codigoIngrediente}</td>
              <td className="px-4 py-2">
                {ing.nombreUnidadMedida || "N/A"}
              </td>
              <td className="px-4 py-2">{ing.nombre}</td>
              <td className="px-4 py-2">{ing.cantidad}</td>
              <td className="px-4 py-2">
                <button
                  onClick={() => openModal(ing)}
                  className="p-2 rounded border border-gray-300 hover:bg-green-100"
                >
                  ✏️
                </button>
              </td>
              <td className="px-4 py-2">
                <button
                  onClick={() => handleInactivate(ing)}
                  className="p-2 rounded border border-gray-300 hover:bg-red-100"
                >
                  ❌
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">
              Editar Ingrediente
            </h2>

            <label className="block text-sm font-semibold mb-1">
              Nuevo nombre:
            </label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded mb-4"
              placeholder="Nombre del ingrediente"
              required
            />

            <label className="block text-sm font-semibold mb-1">
              Nueva unidad de medida:
            </label>
            <select
              value={newUnidad}
              onChange={(e) => setNewUnidad(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded mb-4 bg-white"
            >
              <option value="">-- Seleccione una unidad de medida --</option>
              {unidades.map((unidad) => (
                <option key={unidad.id} value={unidad.nombre}>
                  {unidad.nombre}
                </option>
              ))}
            </select>

            <label className="block text-sm font-semibold mb-1">
              Nueva cantidad:
            </label>
            <input
              type="number"
              value={newCantidad}
              onChange={(e) => setNewCantidad(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded mb-4"
              placeholder="Cantidad"
              step="0.01"
              min="0"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={closeModal}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
                disabled={isPending}
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded"
                disabled={isPending}
              >
                {isPending ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}