"use client";

import { useEffect, useState } from "react";
import IngredientesSelector from "./ingredienteSelector";

type Ingrediente = {
    id: number;
    nombre: string;
};

type SelectedIngrediente = {
    id: number;
    nombre: string;
    cantidadUso: number;
};

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
