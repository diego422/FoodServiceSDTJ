"use client";

import DataTable, { Column } from "../DataTable";
import Link from "next/link";
import { inactivateOrder } from "@/lib/actions";
import { useRouter } from "next/navigation";

export type Pedido = {
  codigoOrden: number;
  numeroOrden: number;
  estado: string;
  precioTotal: string;
  fecha: string;
  metodoPago: string;
  fechaPago: string;
  nombreCliente: string;
  tipoOrden: string;
};

interface Props {
  data: Pedido[];
}

/**
 * OrderTable
 *
 * A component that renders a table of orders with actions.
 *
 * - Displays order data: codes, dates, prices, etc.
 * - Provides buttons to:
 *    - Edit the order (navigates to edit page)
 *    - Inactivate the order (calls server-side action)
 *
 * Props:
 * - data: array of orders to display
 */
export default function OrderTable({ data }: Props) {
  const router = useRouter();

  const columns: Column<Pedido & { modificar: string; inactivar: string }>[] = [
    { key: "codigoOrden", label: "Código Pedido" },
    { key: "numeroOrden", label: "Número Pedido" },
    { key: "estado", label: "Tipo de Estado" },
    { key: "precioTotal", label: "Precio Total" },
    { key: "fecha", label: "Fecha" },
    { key: "metodoPago", label: "Método de Pago" },
    { key: "fechaPago", label: "Fecha de Finalización" },
    { key: "nombreCliente", label: "Nombre del Cliente" },
    {
      key: "tipoOrden",
      label: "Tipo de Pedido",
      render: (value) => (
        <span
          className="block truncate max-w-[160px] whitespace-nowrap"
          title={String(value ?? "")}
        >
          {value || ""}
        </span>
      ),
    },
    {
      key: "modificar",
      label: "Modificar",
      render: (_, row) => (
        <Link
          href={`/dashboard/pedidos/inicio/${row.codigoOrden}/edit`}
          className="p-2 rounded border border-gray-500 hover:bg-green-100 text-white"
          title="Editar"
        >
          ✏️
        </Link>
      ),
    },
    {
      key: "inactivar",
      label: "Inactivar",
      render: (_, row) => (
        <button
          onClick={async () => {
            const response = inactivateOrder(row.codigoOrden);
            if ((await response).success) {
              alert("Orden inactivada correctamente.");
              router.refresh();
            } else {
              alert("Error al inactivar la orden.");
            }
          }}
          className="p-2 rounded border border-gray-300 hover:bg-red-100"
          title="Inactivar"
        >
          ❌
        </button>
      ),
    },
  ];

  const dataWithActions = data.map((d) => ({
    ...d,
    modificar: "",
    inactivar: "",
  }));

  return (
    <div className="mt-6">
      <DataTable columns={columns} data={dataWithActions} />
    </div>
  );
}
