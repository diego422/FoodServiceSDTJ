import { fetchProductoById, updateProducto, fetchIngredientsAll, fetchCategorias } from "@/lib/actions";
import { notFound } from "next/navigation";
import IngredientesField from "@/app/ui/components/Products/ingredientField";


const ingredientes = await fetchIngredientsAll();
const listaDeIngredientes = ingredientes.map((i) => ({
  id: i.C_Ingredients,
  nombre: `${i.D_Ingredients_Name} (${i.Unit_Measurement?.D_Unit_Measurement_Name})`,
}));

const categorias = await fetchCategorias();

export default async function EditProductoPage({
  params,
}: {
  params: { id: string };
}) {

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

        {/*Categoria*/}
      <div className="mb-4">
        <label className="block font-semibold">Categoría:</label>
        <select
          name="nombreCategoria"
          className="w-full p-2 border rounded"
          required
        >
          <option value="">-- Seleccione una categoría --</option>
          {categorias.map((cat) => (
            <option key={cat.C_Category} value={cat.D_Category_Name}>
              {cat.D_Category_Name}
            </option>
          ))}
        </select>
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

        <input type="hidden" name="ingredientesJSON" id="ingredientesJSON" />

        <IngredientesField
          ingredientesDisponibles={listaDeIngredientes}
          ingredientesSeleccionados={producto.Products_Ingredients.map((pi) => ({
            id: pi.C_Ingredients,
            nombre: `${pi.Ingredients.D_Ingredients_Name} (${pi.Ingredients.Unit_Measurement?.D_Unit_Measurement_Name})`,
            cantidadUso: Number(pi.Q_ConsumptionUnit),
          }))}
        />

        <button
          type="submit"
          className="bg-[#0DBC7C] text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Guardar Cambios
        </button>
      </form>
    </main>
  );
}
