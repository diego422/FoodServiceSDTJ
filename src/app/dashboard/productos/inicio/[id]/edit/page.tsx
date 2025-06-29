import { fetchProductoById, updateProducto } from "@/lib/actions";
import { notFound } from "next/navigation";

export default async function EditProductoPage({
  params,
}: {
  params: { id: string };
}) {
  // Obtener producto
  const producto = await fetchProductoById(Number(params.id));

  if (!producto) {
    notFound();
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Editar producto</h1>

      <form
        action={async (formData) => {
          "use server";
          await updateProducto(Number(params.id), formData);
        }}
      >
        {/* Código Producto */}
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Código Producto:</label>
          <input
            name="codigoProducto"
            defaultValue={producto.C_Products}
            className="border rounded w-full px-3 py-2 bg-gray-100 cursor-not-allowed"
            disabled
          />
        </div>

        {/* Nombre */}
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Nombre:</label>
          <input
            name="nombre"
            defaultValue={producto.D_Name}
            className="border rounded w-full px-3 py-2"
          />
        </div>

        {/* Descripción */}
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Descripción:</label>
          <input
            name="descripcion"
            defaultValue={producto.D_Description}
            className="border rounded w-full px-3 py-2"
          />
        </div>

        {/* Precio */}
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Precio:</label>
          <input
            name="precio"
            type="number"
            step="0.01"
            defaultValue={producto.M_Price?.toString()}
            className="border rounded w-full px-3 py-2"
          />
        </div>

        {/* Cantidad */}
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Cantidad:</label>
          <input
            name="cantidad"
            type="number"
            defaultValue={producto.N_Quantity}
            className="border rounded w-full px-3 py-2"
          />
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Guardar Cambios
        </button>
      </form>
    </main>
  );
}
