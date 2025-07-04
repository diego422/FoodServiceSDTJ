"use client";

import DataTable, { Column } from "./DataTable";
import Link from "next/link";

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

export default function OrderTable({ data }: Props) {
  const columns: Column<Pedido & { modificar: string; inactivar: string }>[] = [
    { key: "codigoOrden", label: "Código Orden" },
    { key: "numeroOrden", label: "Número Orden" },
    { key: "estado", label: "Tipo de Estado" },
    { key: "precioTotal", label: "Precio Total" },
    { key: "fecha", label: "Fecha" },
    { key: "metodoPago", label: "Método de Pago" },
    { key: "fechaPago", label: "Fecha de Finalización" },
    { key: "nombreCliente", label: "Nombre del Cliente" },
    {
      key: "tipoOrden",
      label: "Tipo de Orden",
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
          className="p-2 rounded border border-gray-500 hover:bg-yellow-600 text-white"
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
          onClick={() =>
            alert(`Inactivar pedido: ${row.codigoOrden}`)
          }
          className="p-2 rounded border border-gray-500 hover:bg-red-600 text-white"
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
