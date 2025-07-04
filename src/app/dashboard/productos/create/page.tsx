import { createProducto, fetchCategorias, fetchInactivationStates, fetchIngredientsAll } from "@/lib/actions";
import IngredientesField from "@/app/ui/components/Products/ingredientField";

export default async function Page() {

  const categorias = await fetchCategorias();
  const estados = await fetchInactivationStates();
  const ingredientes = await fetchIngredientsAll();

  const listaDeIngredientes = ingredientes.map((i) => ({
    id: i.C_Ingredients,
    nombre: `${i.D_Ingredients_Name} (${i.Unit_Measurement?.D_Unit_Measurement_Name})`,
  }));

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
        <select
          name="nombreEstado"
          className="w-full p-2 border rounded"
          required
        >
          <option value="">-- Seleccione un estado --</option>
          {estados.map((estado) => (
            <option
              key={estado.C_InactivationState}
              value={estado.D_InactivationState}
            >
              {estado.D_InactivationState}
            </option>
          ))}
        </select>
      </div>
      <IngredientesField ingredientesDisponibles={listaDeIngredientes} />
      <button
        type="submit"
        className="bg-[#0DBC7C] hover:bg-green-600 text-white font-bold py-2 px-4 rounded float-right"
      >
        Insertar
      </button>
    </form>
  );
}
