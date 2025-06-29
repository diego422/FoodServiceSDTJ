"use client";

import { createProducto } from "@/lib/actions";

export default function Page() {
  return (
    <form
      action={createProducto}
      className="bg-gray-200 p-6 rounded-lg max-w-lg mx-auto"
    >
      <div className="mb-4">
        <label className="block font-semibold">Código Producto:</label>
        <input
          type="number"
          name="codigoProducto"
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold">Nombre:</label>
        <input
          type="text"
          name="nombre"
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold">Descripción:</label>
        <input
          type="text"
          name="descripcion"
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold">Categoría:</label>
        <input
          type="number"
          name="codigoCategoria"
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold">Precio:</label>
        <input
          type="number"
          name="precio"
          step="0.01"
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold">Cantidad:</label>
        <input
          type="number"
          name="cantidad"
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold">Estado:</label>
        <input
          type="number"
          name="estado"
          className="w-full p-2 border rounded"
          defaultValue={1}
        />
      </div>

      <button
        type="submit"
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded float-right"
      >
        Insertar
      </button>
    </form>
  );
}
