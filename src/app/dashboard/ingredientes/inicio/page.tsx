/**
 * This page is the responsible for displaying the information of a active ingredients.
 * It includes the following functionalities:
 * - Fetching and displaying ingredients with pagination.
 * - Searching ingredients by name or unit of measurement.
 * - Providing a link to insert a new ingredient.
 * - Passing the list of measurement units to the ingredient table for editing purposes.
 */

import prisma from "@/lib/prisma";
import Link from "next/link";
import SearchProducts from "@/app/ui/components/searchProducts";
import Pagination from "@/app/ui/components/pagination";
import IngredienteTable from "@/app/ui/components/Ingredients/ingredienteTable";

type Props = {
  searchParams?: {
    query?: string;
    page?: string;
  };
};

/**
 * This is the main page for display and managing the ingredients.
 * It handles search queries and pagination, and fetches all necessary data 
 * (ingredients and measurement units) from the database to render the ingredient table.
 * @param param0 This is the query parameters for a search and the page.
 * @returns The complete page for a ingredients data.
 */
export default async function IngredientesPage({ searchParams }: Props) {

  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const pageSize = 5;

  const [total, ingredientes] = await Promise.all([
    prisma.ingredients.count({
      where: { C_InactivationState: 1,
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
      where: { C_InactivationState: 1,
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

  const unidades = await prisma.unit_Measurement.findMany({
  select: {
    C_Unit_Measurement: true,
    D_Unit_Measurement_Name: true,
  },
});

const unidadesData = unidades.map((u) => ({
  id: u.C_Unit_Measurement,
  nombre: u.D_Unit_Measurement_Name,
}));


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
        <SearchProducts placeholder="Buscar ingrediente o unidad de medida" />
        <Link
          href="/dashboard/ingredientes/create"
          className="ml-4 bg-[#0DBC7C] hover:bg-green-600 text-white font-semibold px-4 py-2 rounded transition inline-block text-center"
        >
          + Insertar
        </Link>
      </div>

      <IngredienteTable data={data} unidades={unidadesData} />

      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}
