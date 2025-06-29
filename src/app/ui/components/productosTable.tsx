"use client";

import DataTable, { Column } from "./DataTable";

type Producto = {
  codigoProducto: number;
  codigoCategoria: number;
  nombre: string;
  descripcion: string;
  cantidad: number;
  precio: string;
};

interface Props {
  data: Producto[];
}

export default function ProductosTable({ data }: Props) {
  const columns: Column<Producto & { modificar: string; inactivar: string }>[] = [
    { key: "codigoProducto", label: "Código Producto" },
    { key: "codigoCategoria", label: "Código Categoría" },
    { key: "nombre", label: "Nombre del producto" },
    { key: "descripcion", label: "Descripción" },
    { key: "cantidad", label: "Cantidad" },
    { key: "precio", label: "Precio" },
    {
      key: "modificar",
      label: "Modificar",
      render: (_, row) => (
        <button
          onClick={() => alert(`Editar producto: ${row.codigoProducto}`)}
          className="p-2 rounded border border-gray-300 hover:bg-green-100"
          title="Editar"
        >
          ✏️
        </button>
      ),
    },
    {
      key: "inactivar",
      label: "Inactivar",
      render: (_, row) => (
        <button
          onClick={() => alert(`Inactivar producto: ${row.codigoProducto}`)}
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
