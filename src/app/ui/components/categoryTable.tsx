"use client";

import { updateCategoria } from "@/lib/actions";
import { useState, useTransition } from "react";

type Categoria = {
    codigoCategoria: number;
    nombre: string;
};

interface Props {
    data: Categoria[];
}

export default function CategoryTable({ data }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [editingCat, setEditingCat] = useState<Categoria | null>(null);
    const [newName, setNewName] = useState("");
    const [isPending, startTransition] = useTransition();

    const openModal = (categoria: Categoria) => {
        setEditingCat(categoria);
        setNewName(categoria.nombre);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
        setEditingCat(null);
        setNewName("");
    };

    const handleSave = () => {
        if (!editingCat) return;
        startTransition(async () => {
            await updateCategoria(editingCat.codigoCategoria, newName);
            closeModal();
        });
    };

    const handleInactivate = (cat: Categoria) => {
        alert(`Inactivar categoría: ${cat.codigoCategoria}`);
        // Aquí podrías implementar la lógica real para inactivar la categoría
    };

    return (
        <>
            {/* Tabla */}
            <table className="min-w-full text-sm mt-4">
                <thead className="bg-gray-800 text-white uppercase text-xs font-semibold">
                    <tr>
                        <th className="px-4 py-2 text-left">Código Categoría</th>
                        <th className="px-4 py-2 text-left">Nombre</th>
                        <th className="px-4 py-2 text-left">Modificar</th>
                        <th className="px-4 py-2 text-left">Inactivar</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((cat) => (
                        <tr
                            key={cat.codigoCategoria}
                            className="odd:bg-gray-900 even:bg-gray-800 text-white"
                        >
                            <td className="px-4 py-2">{cat.codigoCategoria}</td>
                            <td className="px-4 py-2">{cat.nombre}</td>
                            <td className="px-4 py-2">
                                <button
                                    onClick={() => openModal(cat)}
                                    className="p-2 rounded border border-gray-300 hover:bg-yellow-600"
                                >
                                    ✏️
                                </button>
                            </td>
                            <td className="px-4 py-2">
                                <button
                                    onClick={() => handleInactivate(cat)}
                                    className="p-2 rounded border border-gray-300 hover:bg-red-600"
                                >
                                    ❌
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg w-80">
                        <h2 className="text-lg font-bold mb-4">Editar Categoría</h2>
                        <label className="block text-sm font-semibold mb-1">Nuevo nombre:</label>
                        <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="w-full border border-gray-300 p-2 rounded mb-4"
                            placeholder="Nombre de la categoría"
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={closeModal}
                                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
                                disabled={isPending}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSave}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded"
                                disabled={isPending}
                            >
                                {isPending ? "Guardando..." : "Guardar"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
