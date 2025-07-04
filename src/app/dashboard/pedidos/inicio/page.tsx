import prisma from "@/lib/prisma";
import Link from "next/link";
import Pagination from "@/app/ui/components/pagination";
import OrderTable, { Pedido } from "@/app/ui/components/Orders/orderTable";
import SearchProducts from "@/app/ui/components/searchProducts";

type Props = {
  searchParams?: {
    query?: string;
    page?: string;
  };
};

/**
 * Server component for the "Orders List" page.
 *
 * - Retrieves orders from the database, with filters:
 *   - client name
 *   - order type
 *   - payment method
 * - Supports pagination.
 * - Maps raw Prisma data into a typed list for display.
 * - Renders:
 *   - a search bar
 *   - a link to create a new order
 *   - a table of orders
 *   - pagination controls
 *
 * @param searchParams - Optional query string parameters for filtering and pagination.
 * @returns JSX rendering the orders page.
 */
export default async function PedidosInicioPage({ searchParams }: Props) {
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const pageSize = 5;

  const total = await prisma.order.count({
    where: {
      C_InactivationState: 1, C_State_Type: 1,
      OR: [
        { D_NameClient: { contains: query } },
        { OrderType: { D_OrderType: { contains: query } } },
        { PaymentMethod: { D_Payment_Method_Name: { contains: query } } },
      ],
    },
  });

  const pedidos = await prisma.order.findMany({
    where: {
      C_InactivationState: 1, C_State_Type: 1,
      OR: [
        { D_NameClient: { contains: query } },
        { OrderType: { D_OrderType: { contains: query } } },
        { PaymentMethod: { D_Payment_Method_Name: { contains: query } } },
      ],
    },
    include: {
      OrderType: true,
      PaymentMethod: true,
      StateType: true,
    },
    orderBy: {
      C_Order: "asc",
    },
    skip: (currentPage - 1) * pageSize,
    take: pageSize,
  });

  const data: Pedido[] = pedidos.map((p) => ({
    codigoOrden: Number(p.C_Order),
    numeroOrden: p.N_Order_Number,
    estado: p.StateType?.D_State_Type || "",
    precioTotal: p.M_Total_price?.toFixed(4) || "0.0000",
    fecha: p.F_Order_Date?.toISOString().split("T")[0] || "",
    metodoPago: p.PaymentMethod?.D_Payment_Method_Name || "",
    fechaPago: p.F_Payment_Date
      ? p.F_Payment_Date.toISOString().split("T")[0]
      : "Pendiente",
    nombreCliente: p.D_NameClient || "",
    tipoOrden: p.OrderType?.D_OrderType || "",
  }));

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-foreground">Pedidos</h1>

      <div className="flex justify-between mb-6">
        <SearchProducts placeholder="Buscar por nombre de cliente, tipo de pedido o método de pago" />
        <Link
          href="/dashboard/pedidos/create"
          className="ml-4 bg-[#0DBC7C] hover:bg-green-600 text-white font-semibold px-4 py-2 rounded transition inline-block text-center"
        >
          + Agregar Pedido
        </Link>
      </div>

      <OrderTable data={data} />

      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}
