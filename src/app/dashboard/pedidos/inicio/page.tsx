import prisma from "@/lib/prisma";
import Link from "next/link";
import Pagination from "@/app/ui/components/pagination";
import OrderTable, { Pedido } from "@/app/ui/components/Orders/orderTable";

type Props = {
  searchParams?: {
    query?: string;
    page?: string;
  };
};

export default async function PedidosInicioPage({ searchParams }: Props) {
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const pageSize = 5;

  const total = await prisma.order.count({
    where: {
      OR: [
        { D_NameClient: { contains: query } },
        { OrderType: { D_OrderType: { contains: query } } },
      ],
    },
  });

  const pedidos = await prisma.order.findMany({
    where: {
      OR: [
        { D_NameClient: { contains: query } },
        { OrderType: { D_OrderType: { contains: query } } },
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
        <Link
          href="/dashboard/pedidos/create"
          className="ml-4 bg-[#0DBC7C] hover:bg-green-600 text-white font-semibold px-4 py-2 rounded transition inline-block text-center"
        >
          + Agregar Orden
        </Link>
      </div>

      <OrderTable data={data} />

      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}
