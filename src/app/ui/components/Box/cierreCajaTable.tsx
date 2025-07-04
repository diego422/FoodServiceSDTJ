"use client";

import DataTable, { Column } from "@/app/ui/components/DataTable";
import React from "react";

type CierreCaja = {
  codigo: string;
  fechaApertura: string;
  fechaCierre: string;
  fondoTrabajo: string;
  montoGenerado: string;
  ventasEfectivo: string;
  ventasSinpe: string;
  cierreTotal: string;
};

interface Props {
  data: CierreCaja[];
}

/**
 * CierreCajaTable
 *
 * Displays a table with cash register closure history, showing:
 * - Code
 * - Opening and closing dates
 * - Cash fund and sales figures
 *
 * Props:
 * - data: Array of cash register closure records to display.
 */
export default function CierreCajaTable({ data }: Props) {
  const columns: Column<CierreCaja>[] = [
    { key: "codigo", label: "Código" },
    { key: "fechaApertura", label: "Fecha de apertura" },
    { key: "fechaCierre", label: "Fecha de cierre" },
    { key: "fondoTrabajo", label: "Fondo de trabajo" },
    { key: "montoGenerado", label: "Monto generado" },
    { key: "ventasEfectivo", label: "Ventas efectivo" },
    { key: "ventasSinpe", label: "Ventas SINPE" },
    { key: "cierreTotal", label: "Cierre de Caja" },
  ];

  return <DataTable columns={columns} data={data} />;
}
