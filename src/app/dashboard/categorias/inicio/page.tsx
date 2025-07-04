import { createCategoria, fetchCategorias } from "@/lib/actions";
import CategoryTable from "@/app/ui/components/Category/categoryTable";
import Pagination from "@/app/ui/components/pagination";

type Props = {
  searchParams?: {
    page?: string;
  };
};

export default async function CategoriasInicioPage({ searchParams }: Props) {
  const currentPage = Number(searchParams?.page) || 1;
  const pageSize = 5;

  const categorias = await fetchCategorias();

  const total = categorias.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const paginatedCategorias = categorias.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const data = paginatedCategorias.map((cat) => ({
    codigoCategoria: cat.C_Category,
    nombre: cat.D_Category_Name,
  }));

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-foreground">
        Categorías
      </h1>

      <form
        action={createCategoria}
        className="flex gap-4 bg-gray-800 p-4 rounded text-white mb-6"
      >
        <div className="flex flex-col">
          <label className="text-sm font-bold">Código Categoría:</label>
          <input
            type="number"
            name="codigoCategoria"
            className="w-40 p-2 border rounded bg-gray-700 text-white placeholder-gray-400"
            placeholder="Ej. 1"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-bold">Nombre:</label>
          <input
            type="text"
            name="nombre"
            className="w-60 p-2 border rounded bg-gray-700 text-white placeholder-gray-400"
            placeholder="Ej. Bebidas"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-[#0DBC7C] hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded self-end"
        >
          Agregar Categoría
        </button>
      </form>

      <CategoryTable data={data} />

      <div className="mt-6">
        <Pagination currentPage={currentPage} totalPages={totalPages} />
      </div>
    </main>
  );
}
