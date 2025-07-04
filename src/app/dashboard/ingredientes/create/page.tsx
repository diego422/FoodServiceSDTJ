/**
 * In this page the users is allowed to insert new ingredients in the system.
 * The main features in this pages include:
 * - Fetching a unit measurements and inactivarion state for a form dropdowns.
 * - Displaying a form to the utility for a insert a new ingredient with fields like code, name, unit, 
 * quantity and status.
 * - Submitting the form with a server action called createIngredients.
 */

import { createIngredients, fetchUnidadMedidad, fetchInactivationStates } from "@/lib/actions";
import Link from "next/link";

/**
 * This page is for the creation of a new ingredient.
 * It renders a full form with the necesary information of a user required 
 * to create a ingredient, and have the submits it to the backend via a 
 * server actions.
 * @returns a form for a ingredient creation.
 */
export default async function Page() {

    const unidadDeMedidad = await fetchUnidadMedidad();
    const estados = await fetchInactivationStates();

    return (
        <form
            action={createIngredients}
        >
            <div className="mb-4">
                <h1 className="text-2xl font-bold mb-4">Crear Ingrediente</h1>
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
                    min="0"
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
            <Link
                href="/dashboard/ingredientes/inicio"
                className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded bg-gray-800 text-white hover:bg-gray-700 transition"
            >
                ← Cancelar
            </Link>
        </form>
    );
}
