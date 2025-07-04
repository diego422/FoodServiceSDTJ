import prisma from "@/lib/prisma";
import Link from "next/link";
import SearchProducts from "@/app/ui/components/searchProducts";
import Pagination from "@/app/ui/components/pagination";
import ProductosTable from "@/app/ui/components/Products/productosTable";
import ModalErrorProduct from "@/app/ui/components/Products/modalErrorProduct";

type Props = {
  searchParams?: {
    query?: string;
    page?: string;
    error?: string;
  };
};

/**
 * Server component for the Products page.
 *
 * - Fetches products from the database.
 * - Supports filtering by product name or category name.
 * - Handles pagination.
 * - Maps the raw database data into a simpler object structure for rendering in the table.
 * - Renders the product list, a search input, and pagination controls.
 *
 * @param searchParams - Optional search parameters for filtering and pagination.
 * @returns JSX rendering the page.
 */
export default async function ProductosPage({ searchParams }: Props) {
  const query = searchParams?.query || "";
  const error = searchParams?.error || "";
  const currentPage = Number(searchParams?.page) || 1;
  const pageSize = 5;

  /**
   * Filtrado:
   * - por nombre del producto
   * - o por nombre de la categoría
   */

  // Filtrar productos
  const [total, productos] = await Promise.all([
    prisma.products.count({
      where: { C_InactivationState: 1,
        OR: [
          {
            D_Name: {
              contains: query,
            },
          },
          {
            Category: {
              D_Category_Name: {
                contains: query,
              },
            },
          },
        ],
      },
    }),
    prisma.products.findMany({
      where: { C_InactivationState: 1,
        OR: [
          {
            D_Name: {
              contains: query,
            },
          },
          {
            Category: {
              D_Category_Name: {
                contains: query,
              },
            },
          },
        ],
      },
      include: {
        Category: true,
      },
      orderBy: {
        C_Products: "asc",
      },
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const data = productos.map((p) => ({
    codigoProducto: p.C_Products,
    nombreCategoria: p.Category?.D_Category_Name || "Sin categoría",
    nombre: p.D_Name,
    descripcion: p.D_Description,
    cantidad: p.N_Quantity,
    precio: p.M_Price.toFixed(4),
  }));

  return (
    <div className="p-6">
      <ModalErrorProduct error={error} />
      <h1 className="text-3xl font-bold mb-6 text-foreground">
        Productos
      </h1>

      <div className="flex justify-between mb-6">
        <SearchProducts placeholder="Buscar producto o categoría" />
        <Link
          href="/dashboard/productos/create"
          className="ml-4 bg-[#0DBC7C] hover:bg-green-600 text-white font-semibold px-4 py-2 rounded transition inline-block text-center"
        >
          + Insertar
        </Link>
      </div>

      <ProductosTable data={data} />

      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}
