"use client";

import DataTable, { Column } from "./DataTable";
import Link from "next/link";
import { Decimal } from "@prisma/client/runtime/library";

  type Ingrediente = {

    codigoIngrediente: number,
    nombreUnidadMedida: string,
    nombre: string,
    cantidad: Decimal,
};

interface Props {
  data: Ingrediente[];
}

export default function ingredienteTable({ data }: Props) {
    const columns: Column<Ingrediente & { modificar: string; inactivar: string }>[] = [
    { key: "codigoIngrediente", label: "Código Ingrediente" },
    { key: "nombreUnidadMedida", label: "Unidad de medida" }, // ✅ mostrar nombre
    { key: "nombre", label: "Nombre del ingrediente" },
    { key: "cantidad", label: "Cantidad" },
    {
      key: "modificar",
      label: "Modificar",
      render: (_, row) => (
        <Link
          href={`/dashboard/productos/inicio/${row.codigoIngrediente}/edit`}
          className="p-2 rounded border border-gray-300 hover:bg-green-100"
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
          onClick={() => alert(`Inactivar producto: ${row.codigoIngrediente}`)}
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

  return <DataTable columns={columns} data={dataWithActions} />;
}
