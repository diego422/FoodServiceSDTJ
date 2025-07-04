"use client";

import DataTable, { Column } from "../DataTable";

type Sales = {
    salesCode: string;
    orderCode: string;
    saleDate: string;
    totalSale: string;
    clientName: string;
    paymentMethodName: string;
    orderTypeName: string;
};

interface Props {
    data: Sales[];
}

/**
 * ReportsTable
 *
 * Renderiza una tabla de reportes de ventas:
 * - Define columnas con etiquetas.
 * - Muestra datos como código, fechas, montos, cliente y métodos de pago.
 *
 * Props:
 * @param data - Arreglo de ventas a mostrar en la tabla.
 */
export default function ReportsTable({ data }: Props) {
    const columns: Column<Sales>[] = [
        { key: "salesCode", label: "Código venta" },
        { key: "orderCode", label: "Código orden" },
        { key: "saleDate", label: "Fecha de venta" },
        { key: "totalSale", label: "Total venta" },
        { key: "clientName", label: "Nombre cliente" },
        { key: "paymentMethodName", label: "Metodo de pago" },
        { key: "orderTypeName", label: "Tipo de orden" },

    ];


    const dataWithActions = data.map((d) => ({
        ...d,
        // saleDate: new Date(d.saleDate).toLocaleDateString("es-CR", {
        //     year: "numeric",
        //     month: "2-digit",
        //     day: "2-digit",
        //     }),
        }));

    return <DataTable columns={columns} data={dataWithActions} />;
}
