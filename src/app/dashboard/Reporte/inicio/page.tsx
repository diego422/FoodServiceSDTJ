import prisma from "@/lib/prisma";
import Link from "next/link";
import SearchProducts from "@/app/ui/components/searchProducts";
import Pagination from "@/app/ui/components/pagination";
import ReportsTable from "@/app/ui/components/Report/reportsTable";

type Props = {
    searchParams?: {
        query?: string;
        query2?: Date;
        page?: string;
    };
};

export default async function ProductosPage({ searchParams }: Props) {

    const rawQuery = searchParams?.query || "";
let query = rawQuery;
let query2 = "";

const maybeDate = new Date(rawQuery);
if (!isNaN(maybeDate.getTime()) && /^\d{4}-\d{2}-\d{2}$/.test(rawQuery)) {
  query2 = rawQuery;
  query = ""; 
}

    const currentPage = Number(searchParams?.page) || 1;
    const pageSize = 5;
    const isValidQuery2Date = !isNaN(new Date(query2).getTime());


    /**
     * Filtrado:
     * - por nombre del producto
     * - o por nombre de la categoría
     */

    // Filtrar productos
    const [total, sales] = await Promise.all([
        prisma.sales.count({
            where: {
                OR: [
                    {
                        D_NameClient: {
                            contains: query,
                        },
                    },
                    ...(isValidQuery2Date
      ? [{
          F_Bill_Date: {
            gte: new Date(`${query2}T00:00:00`),
            lte: new Date(`${query2}T23:59:59`),
          },
        }]
      : []),
                    {

                    },
                ],
            },
        }),
        prisma.sales.findMany({
            where: {
                OR: [
                    {
                        D_NameClient: {
                            contains: query,
                        },

                    },
                    ...(isValidQuery2Date
      ? [{
          F_Bill_Date: {
            gte: new Date(`${query2}T00:00:00`),
            lte: new Date(`${query2}T23:59:59`),
          },
        }]
      : []),
                    {
 
                    },
                ],
            },
            include: {
                PaymentMethod: true,
                OrderType: true
            },
            orderBy: {
                C_Sales: "asc",
            },
            skip: (currentPage - 1) * pageSize,
            take: pageSize,
        }),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    const data = sales.map((s) => ({
        salesCode: s.C_Sales,
        orderCode: s.C_Order,
        saleDate: s.F_Bill_Date.toISOString().split("T")[0],
        totalSale: s.M_Total_Price.toFixed(4),
        clientName: s.D_NameClient,
        paymentMethodName: s.PaymentMethod?.D_Payment_Method_Name || "Sin metodo de pago",
        orderTypeName: s.OrderType?.D_OrderType || "Sin tipo de orden"
    }));

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6 text-foreground">
                Reportes
            </h1>

            <div className="flex justify-between mb-6">
                <SearchProducts placeholder="Buscar por nombre de cliente o fecha (YYYY/MM/DD)" />
            </div>

            <ReportsTable data={data} />

            <Pagination currentPage={currentPage} totalPages={totalPages} />
        </div>
    );
}
