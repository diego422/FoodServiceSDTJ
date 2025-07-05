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
        { key: "salesCode", label: "Código Venta" },
        { key: "orderCode", label: "Código Pedido" },
        { key: "saleDate", label: "Fecha de venta" },
        { key: "totalSale", label: "Total de venta" },
        { key: "clientName", label: "Nombre cliente" },
        { key: "paymentMethodName", label: "Metodo de pago" },
        { key: "orderTypeName", label: "Tipo de pedido" },

    ];


    const dataWithActions = data.map((d) => ({
        ...d,
        }));

    return <DataTable columns={columns} data={dataWithActions} />;
}
