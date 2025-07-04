/**
 * This is the component for a product, the IngredientField.
 * 
 * This component is the responsible to a  wraps the `IngredientesSelector` component and manages the selected ingredients,
 * storing the list as a hidden input (`ingredientesJSON`) for submission via a form.
 */

"use client";

import { useEffect, useState } from "react";
import IngredientesSelector from "../Products/ingredienteSelector";

type Ingrediente = {
    id: number;
    nombre: string;
};

type SelectedIngrediente = {
    id: number;
    nombre: string;
    cantidadUso: number;
};

/**
 * This is a function responsible for renders an ingredient selection with a interface and synchronizes the selected values 
 * into a hidden input with a JSON string, which is compatible with form submissions.
 * 
 * @param param0 The components props
 * @returns A form field with ingredient selector and a hidden input.
 */
export default function IngredientesField({
    ingredientesDisponibles,
    ingredientesSeleccionados = [],
}: {
    ingredientesDisponibles: Ingrediente[];
    ingredientesSeleccionados?: SelectedIngrediente[];
}) {
    const [seleccionados, setSeleccionados] = useState<SelectedIngrediente[]>(ingredientesSeleccionados);

    useEffect(() => {
        const hiddenInput = document.getElementById("ingredientesJSON") as HTMLInputElement;
        if (hiddenInput) {
            hiddenInput.value = JSON.stringify(seleccionados);
        }
    }, [seleccionados]);

    return (
        <div className="mb-4">
            <label className="block font-semibold">Ingredientes:</label>
            <input type="hidden" name="ingredientesJSON" id="ingredientesJSON" />
            <IngredientesSelector
                ingredientesDisponibles={ingredientesDisponibles}
                onChange={setSeleccionados}
                initialValue={ingredientesSeleccionados}
            />
        </div>
    );
}
