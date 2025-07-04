/**
 * This is the component for a product, the Ingredientesselector.
 * 
 * This component is the responsible to a select a ingredient from a list, assign this ingredient usage quantities, 
 * and remove selections. Is helping to build a recipe or a product composition.
 */

"use client";

import { useState } from "react";

type Ingrediente = {
  id: number;
  nombre: string;
};

type SelectedIngrediente = {
  id: number;
  nombre: string;
  cantidadUso: number;
};

/**
 * This function is the responsible for render a selector for adding, adjusting and removing ingredients with quantities.
 * @param param0 A components props.
 * @returns A selector UI for ingredients.
 */
export default function IngredientesSelector({
  ingredientesDisponibles,
  onChange,
  initialValue = [],
}: {
  ingredientesDisponibles: Ingrediente[];
  onChange: (ingredientes: SelectedIngrediente[]) => void;
  initialValue?: SelectedIngrediente[];
}) {
  const [seleccionados, setSeleccionados] = useState<SelectedIngrediente[]>(initialValue);

  const agregar = (id: number, nombre: string) => {
    if (!seleccionados.find((i) => i.id === id)) {
      const nuevo = [...seleccionados, { id, nombre, cantidadUso: 1 }];
      setSeleccionados(nuevo);
      onChange(nuevo);
    }
  };

  const cambiarCantidad = (id: number, cantidad: number) => {
    const nuevo = seleccionados.map((i) =>
      i.id === id ? { ...i, cantidadUso: cantidad } : i
    );
    setSeleccionados(nuevo);
    onChange(nuevo);
  };

  const eliminar = (id: number) => {
    const nuevo = seleccionados.filter((i) => i.id !== id);
    setSeleccionados(nuevo);
    onChange(nuevo);
  };

  return (
    <div className="space-y-2">
      <select
        onChange={(e) => {
          const id = Number(e.target.value);
          const nombre = ingredientesDisponibles.find((i) => i.id === id)?.nombre;
          if (id && nombre) agregar(id, nombre);
        }}
        className="w-full p-2 border rounded bg-white max-h-48 overflow-y-auto"
      >
        <option value="">-- Seleccione un ingrediente --</option>
        {ingredientesDisponibles.map((i) => (
          <option key={i.id} value={i.id}>{i.nombre}</option>
        ))}
      </select>


      <ul>
        {seleccionados.map((i) => (
          <li key={i.id} className="flex items-center gap-2">
            <span>{i.nombre}</span>
            <input
              type="number"
              min={0}
              value={i.cantidadUso}
              onChange={(e) => cambiarCantidad(i.id, parseFloat(e.target.value))}
              className="w-20 border px-1"
            />
            <button type="button" onClick={() => eliminar(i.id)} className="text-red-500">
              ✕
            </button>
          </li>
        ))}
      </ul>
      
    </div>
  );
}
