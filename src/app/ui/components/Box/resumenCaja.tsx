
"use client";

interface ResumenProps {
  fondoTrabajo: number;
  totalEfectivo: number;
  totalSinpe: number;
  totalVentas: number;
  cierreCaja: number;
}

/**
 * ResumenCaja
 *
 * Displays a summary grid showing financial figures for the cash register:
 * - Work fund (fondo de trabajo)
 * - Total cash
 * - Total SINPE
 * - Total sales
 * - Total box closing
 *
 * Props:
 * - fondoTrabajo: initial fund amount
 * - totalEfectivo: total cash sales
 * - totalSinpe: total SINPE sales
 * - totalVentas: total sales amount
 * - cierreCaja: total closing balance
 */
export default function ResumenCaja({
  fondoTrabajo,
  totalEfectivo,
  totalSinpe,
  totalVentas,
  cierreCaja,
}: ResumenProps) {
  const items = [
    { label: "Fondo de trabajo", value: fondoTrabajo },
    { label: "Total en efectivo", value: totalEfectivo },
    { label: "Total por SINPE", value: totalSinpe },
    { label: "Total ventas", value: totalVentas },
    { label: "Total cierre de caja", value: cierreCaja },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {items.map((item) => (
        <div
          key={item.label}
          className="bg-white shadow rounded-xl p-4 border border-gray-200"
        >
          <h3 className="text-gray-600 text-sm mb-1">{item.label}</h3>
          <p className="text-xl font-bold text-gray-800">₡ {item.value.toFixed(2)}</p>
        </div>
      ))}
    </div>
  );
}
