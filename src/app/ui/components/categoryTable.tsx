"use client";

import DataTable, { Column } from "./DataTable";
import Link from "next/link";

type Categoria = {
  codigoCategoria: number;
  nombre: string;
};

interface Props {
  data: Categoria[];
}

export default function CategoryTable({ data }: Props) {
  const columns: Column<Categoria & { modificar: string; inactivar: string }>[] = [
    { key: "codigoCategoria", label: "Código Categoría" },
    { key: "nombre", label: "Nombre" },
    {
      key: "modificar",
      label: "Modificar",
      render: (_, row) => (
        <Link
          href={`/dashboard/categorias/inicio/${row.codigoCategoria}/edit`}
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
          onClick={() => alert(`Inactivar categoría: ${row.codigoCategoria}`)}
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
