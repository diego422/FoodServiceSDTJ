/**
 * This page is the responsable for present de information for the categories,
 * in this page is allowed:
 * - Display a table with the data of category.
 * - Insert a new category via form.
 * - View others categories in a list with a pagination.
 */

import { createCategoria, fetchCategorias } from "@/lib/actions";
import CategoryTable from "@/app/ui/components/Category/categoryTable";
import Pagination from "@/app/ui/components/pagination";
import ModalErrorCategory from "@/app/ui/components/Category/modalErrorCategory";

type Props = {
  searchParams?: {
    page?: string;
    error?: string;
  };
};

/**
 * This is a server component for a renderize the main category view.
 * 
 * This is in charge to fetches all categories from the database, calculates the total of pagination,
 * and renders a list with the data of the categories with a form to add new ones.
 * @param param0 Contains optional query parameters, including the current page.
 * @returns The rendered page.
 */
export default async function CategoriasInicioPage({ searchParams }: Props) {
  const currentPage = Number(searchParams?.page) || 1;
  const pageSize = 5;
    const error = searchParams?.error || "";

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
      <ModalErrorCategory error={error} />
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
