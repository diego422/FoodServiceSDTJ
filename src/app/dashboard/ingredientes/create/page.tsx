import { createIngredients, fetchUnidadMedidad, fetchInactivationStates } from "@/lib/actions";

export default async function Page() {

    const unidadDeMedidad = await fetchUnidadMedidad();
    const estados = await fetchInactivationStates();

    return (
        <form
            action={createIngredients}
            className="bg-gray-200 p-6 rounded-lg max-w-lg mx-auto"
        >
            <div className="mb-4">
                <label className="block font-semibold">Código Ingrediente:</label>
                <input
                    type="number"
                    name="codigoIngrediente"
                    className="w-full p-2 border rounded"
                    required
                />
            </div>

            <div className="mb-4">
                <label className="block font-semibold">Nombre:</label>
                <input
                    type="text"
                    name="nombre"
                    className="w-full p-2 border rounded"
                    required
                />
            </div>

            <div className="mb-4">
                <label className="block font-semibold">Unidad de medida:</label>
                <select
                    name="nombreUnidadMedida"
                    className="w-full p-2 border rounded"
                    required
                >
                    <option value="">-- Seleccione una unidad de medida --</option>
                    {unidadDeMedidad.map((unit) => (
                        <option key={unit.C_Unit_Measurement} value={unit.D_Unit_Measurement_Name}>
                            {unit.D_Unit_Measurement_Name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="mb-4">
                <label className="block font-semibold">Cantidad:</label>
                <input
                    type="number"
                    name="cantidad"
                    className="w-full p-2 border rounded"
                    required
                />
            </div>

            <div className="mb-4">
                <label className="block font-semibold">Estado:</label>
                <select
                    name="nombreEstado"
                    className="w-full p-2 border rounded"
                    required
                >
                    <option value="">-- Seleccione un estado --</option>
                    {estados.map((estado) => (
                        <option
                            key={estado.C_InactivationState}
                            value={estado.D_InactivationState}
                        >
                            {estado.D_InactivationState}
                        </option>
                    ))}
                </select>
            </div>

            <button
                type="submit"
                className="bg-[#0DBC7C] hover:bg-green-600 text-white font-bold py-2 px-4 rounded float-right"
            >
                Insertar
            </button>
        </form>
    );
}
