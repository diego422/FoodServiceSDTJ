import prisma from "@/lib/prisma";
import CierreCajaTable from "@/app/ui/components/Box/cierreCajaTable";
import Pagination from "@/app/ui/components/pagination";
import { closeCaja, getBoxForToday, openNewBox } from "@/lib/actions";
import ResumenCaja from "@/app/ui/components/Box/resumenCaja";

type Props = {
    searchParams?: {
        page?: string;
    };
};

function safeNumber(val: any): number {
    try {
        if (!val) return 0;
        if (typeof val.toNumber === "function") return val.toNumber();
        if (typeof val === "object" && val.value) return Number(val.value);
        return Number(val);
    } catch {
        return 0;
    }
}

export default async function CierreCajaPage({ searchParams }: Props) {
    const currentPage = Number(searchParams?.page) || 1;
    const pageSize = 5;

    const [total, cajas] = await Promise.all([
        prisma.box.count(),
        prisma.box.findMany({
            orderBy: {
                F_OpenDateTime: "desc",
            },
            skip: (currentPage - 1) * pageSize,
            take: pageSize,
        }),
    ]);

const data = cajas.map((c) => ({
  codigo: c.C_Box ?? "No disponible",
  fechaApertura: c.F_OpenDateTime?.toLocaleDateString(),   
  fechaCierre: c.F_CloseDateTime?.toLocaleDateString(), 
  fondoTrabajo: c.M_OpenBox ? `₡${safeNumber(c.M_OpenBox).toFixed(2)}` : "No disponible",
  montoGenerado: c.M_TotalSales ? `₡${safeNumber(c.M_TotalSales).toFixed(2)}` : "No disponible",
  ventasEfectivo: c.M_TotalCash ? `₡${safeNumber(c.M_TotalCash).toFixed(2)}` : "No disponible",
  ventasSinpe: c.M_TotalSinpe ? `₡${safeNumber(c.M_TotalSinpe).toFixed(2)}` : "No disponible",
  cierreTotal: c.M_CloseBox ? `₡${safeNumber(c.M_CloseBox).toFixed(2)}` : "₡0.00",
}));

console.log(data);
    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    const cajaAbiertaRaw = await getBoxForToday();

    const cajaAbierta = cajaAbiertaRaw
        ? {
            codigo: cajaAbiertaRaw.C_Box,
            fechaApertura: cajaAbiertaRaw.F_OpenDateTime?.toISOString() ?? null,
            fechaCierre: cajaAbiertaRaw.F_CloseDateTime?.toISOString() ?? null,
            fondoTrabajo: Number(cajaAbiertaRaw.M_OpenBox ?? 0),
            totalVentas: Number(cajaAbiertaRaw.M_TotalSales ?? 0),
            totalEfectivo: Number(cajaAbiertaRaw.M_TotalCash ?? 0),
            totalSinpe: Number(cajaAbiertaRaw.M_TotalSinpe ?? 0),
            cierreCaja: Number(cajaAbiertaRaw.M_CloseBox ?? 0),
        }
        : null;

    console.log("Caja abierta raw", cajaAbiertaRaw?.F_OpenDateTime, cajaAbiertaRaw?.F_CloseDateTime);
    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6 text-foreground">
                Historial de Cierres de Caja
            </h1>

            <div className="flex justify-end mb-4">
                {cajaAbierta?.fechaCierre == null && cajaAbierta?.codigo && (
                    <form action={closeCaja}>
                        <input type="hidden" name="boxId" value={cajaAbierta.codigo} />
                        <button
                            type="submit"
                            className="bg-[#0DBC7C] hover:bg-green-700 text-white px-4 py-2 rounded"
                        >
                            Cerrar Caja
                        </button>
                    </form>
                )}
                {cajaAbierta?.fechaCierre && (
                    <form action={openNewBox} className="flex items-center gap-2">
                        <input
                            type="text"
                            name="montoInicial"
                            placeholder="₡ Monto inicial"
                            pattern="^\d+(\.\d{1,2})?$"
                            title="Ingrese un número válido (máximo 2 decimales)"
                            required
                            className="border border-gray-300 px-3 py-1 rounded"
                        />

                        <button
                            type="submit"
                            className="bg-[#0DBC7C] hover:bg-green-700 text-white px-4 py-2 rounded"
                        >
                            Abrir Nueva Caja
                        </button>
                    </form>
                )}
            </div>

            {cajaAbierta && (
                <ResumenCaja
                    fondoTrabajo={cajaAbierta.fondoTrabajo}
                    totalVentas={cajaAbierta.totalVentas}
                    totalEfectivo={cajaAbierta.totalEfectivo}
                    totalSinpe={cajaAbierta.totalSinpe}
                    cierreCaja={cajaAbierta.cierreCaja}
                />
            )}

            <div className="mt-6">
                <CierreCajaTable data={data} />
                <Pagination currentPage={currentPage} totalPages={totalPages} />
            </div>
        </div>
    );
}
