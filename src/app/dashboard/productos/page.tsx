import prisma from "@/lib/prisma";
import SearchProducts from "@/app/ui/components/searchProducts";
import Pagination from "@/app/ui/components/pagination";
import ProductosTable from "@/app/ui/components/productosTable";

type Props = {
  searchParams?: {
    query?: string;
    page?: string;
  };
};

export default async function ProductosPage({ searchParams }: Props) {
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const pageSize = 5;

  const total = await prisma.products.count({
    where: {
      OR: [
        {
          D_Name: {
            contains: query,
          },
        },
        {
          C_Category: {
            equals: query === "" ? undefined : Number(query) || undefined,
          },
        },
      ],
    },
  });

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const productos = await prisma.products.findMany({
    where: {
      OR: [
        {
          D_Name: {
            contains: query,
          },
        },
        {
          C_Category: {
            equals: query === "" ? undefined : Number(query) || undefined,
          },
        },
      ],
    },
    orderBy: {
      C_Products: "asc",
    },
    skip: (currentPage - 1) * pageSize,
    take: pageSize,
  });

  const data = productos.map((p) => ({
    codigoProducto: p.C_Products,
    codigoCategoria: p.C_Category,
    nombre: p.D_Name,
    descripcion: p.D_Description,
    cantidad: p.N_Quantity,
    precio: p.M_Price.toFixed(4),
  }));

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-foreground">Productos</h1>

      <div className="flex justify-between mb-6">
        <SearchProducts placeholder="Buscar producto o categoría" />
        <button className="ml-4 bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded transition">
          + Insertar
        </button>
      </div>

      <ProductosTable data={data} />

      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}
