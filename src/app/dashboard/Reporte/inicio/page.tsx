import prisma from "@/lib/prisma";
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

/**
 * ProductosPage
 *
 * Server Component that displays a sales report.
 *
 * Features:
 * - Accepts search parameters (customer name or date).
 * - Filters sales based on:
 *    - Client name (partial match)
 *    - Specific bill date
 * - Paginates results.
 * - Loads related payment method and order type info.
 *
 * Renders:
 * - Search bar
 * - ReportsTable component with sales data
 * - Pagination controls
 */
export default async function ProductosPage({ searchParams }: Props) {

    const rawQuery = searchParams?.query || "";
    let query = rawQuery;
    let query2 = "";

    const formattedDate = rawQuery.replace(/\//g, "-");
    const maybeDate = new Date(formattedDate);

    if (!isNaN(maybeDate.getTime()) && /^\d{4}-\d{2}-\d{2}$/.test(formattedDate)) {
        query2 = formattedDate;
        query = "";
    }

    const currentPage = Number(searchParams?.page) || 1;
    const pageSize = 5;
    const isValidQuery2Date = !isNaN(new Date(query2).getTime());


    const filters: any[] = [];

    if (query) {
        filters.push({
            D_NameClient: {
                contains: query,
            },
        });
    }

    if (isValidQuery2Date) {
        filters.push({
            F_Bill_Date: {
                gte: new Date(`${query2}T00:00:00`),
                lte: new Date(`${query2}T23:59:59`),
            },
        });
    }

    const whereCondition = filters.length > 0 ? { OR: filters } : {};

    const [total, sales] = await Promise.all([
        prisma.sales.count({ where: whereCondition }),
        prisma.sales.findMany({
            where: whereCondition,
            include: {
                PaymentMethod: true,
                OrderType: true,
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
        salesCode: s.C_Sales.toString(),
        orderCode: s.C_Order.toString(),
        saleDate: s.F_Bill_Date.toISOString().split("T")[0],
        totalSale: s.M_Total_Price.toFixed(4),
        clientName: s.D_NameClient ?? "",
        paymentMethodName: s.PaymentMethod?.D_Payment_Method_Name || "Sin metodo de pago",
        orderTypeName: s.OrderType?.D_OrderType || "Sin tipo de orden",
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
