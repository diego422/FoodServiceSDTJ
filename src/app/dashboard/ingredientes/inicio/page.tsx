import prisma from "@/lib/prisma";
import Link from "next/link";
// import SearchProducts from "@/app/ui/components/searchProducts";
import Pagination from "@/app/ui/components/pagination";
import IngredienteTable from "@/app/ui/components/Ingredients/ingredienteTable";

type Props = {
  searchParams?: {
    query?: string;
    page?: string;
  };
};

export default async function IngredientesPage({ searchParams }: Props) {

  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const pageSize = 5;

  /**
   * Filtrado:
   * - por nombre del producto
   * - o por nombre de la categoría
   */

  // Filtrar productos
  const [total, ingredientes] = await Promise.all([
    prisma.ingredients.count({
      where: {
        OR: [
          {
            D_Ingredients_Name: {
              contains: query,
            },
          },
          {
            Unit_Measurement: {
              D_Unit_Measurement_Name: {
                contains: query,
              },
            },
          },
        ],
      },
    }),
    prisma.ingredients.findMany({
      where: {
        OR: [
          {
            D_Ingredients_Name: {
              contains: query,
            },
          },
          {
            Unit_Measurement: {
              D_Unit_Measurement_Name: {
                contains: query,
              },
            },
          },
        ],
      },
      include: {
        Unit_Measurement: true,
      },
      orderBy: {
        C_Ingredients: "asc",
      },
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
    }),
  ]);


  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const data = ingredientes.map((i) => ({
    codigoIngrediente: i.C_Ingredients,
    nombreUnidadMedida: i.Unit_Measurement?.D_Unit_Measurement_Name,
    nombre: i.D_Ingredients_Name,
    cantidad: i.Q_Quantity.toNumber().toFixed(4)??"0.00",
  }));

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-foreground">
        Ingredientes
      </h1>

      <div className="flex justify-between mb-6">
        {/* <SearchProducts placeholder="Buscar producto o categoría" /> */}
        <Link
          href="/dashboard/ingredientes/create"
          className="ml-4 bg-[#0DBC7C] hover:bg-green-600 text-white font-semibold px-4 py-2 rounded transition inline-block text-center"
        >
          + Insertar
        </Link>
      </div>

      <IngredienteTable data={data} />

      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}
