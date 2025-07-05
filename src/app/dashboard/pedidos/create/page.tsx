"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AddProductsModal from "@/app/ui/components/Orders/AddProductsModal";
import { insertOrder, fetchMetodosPago, fetchTiposOrden } from "@/lib/actions";
import { Product, Ingrediente } from "@/lib/typesProducts";

export default function CreateOrderPage() {
    const router = useRouter();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState<
        { id: number; name: string; price: number; quantity: number; ingredientes?: Ingrediente[] }[]
    >([]);
    const [nombreCliente, setNombreCliente] = useState("");
    const [tipoOrden, setTipoOrden] = useState("");
    const [metodoPago, setMetodoPago] = useState("");

    const [tiposOrden, setTiposOrden] = useState<{ id: number; nombre: string }[]>([]);
    const [metodosPago, setMetodosPago] = useState<{ id: number; nombre: string }[]>([]);

    useEffect(() => {
        async function fetchData() {
            const [tipos, metodos] = await Promise.all([
                fetchTiposOrden(),
                fetchMetodosPago(),
            ]);
            setTiposOrden(tipos);
            setMetodosPago(metodos);
        }

        fetchData();
    }, []);

    const handleAddProduct = (
        product: Product,
        quantity: number,
        ingredientes?: Ingrediente[]
    ) => {
        setSelectedProducts((prev) => {
            const existing = prev.find((p) => p.id === product.id);
            if (existing) {
                return prev.map((p) =>
                    p.id === product.id
                        ? {
                            ...p,
                            quantity: p.quantity + quantity,
                            ingredientes: ingredientes ?? p.ingredientes,
                        }
                        : p
                );
            } else {
                return [
                    ...prev,
                    { ...product, quantity, ingredientes: ingredientes || [] },
                ];
            }
        });
    };

    const handleRemoveProduct = (id: number) => {
        setSelectedProducts((prev) => prev.filter((p) => p.id !== id));
    };

    const handleSubmit = async () => {
        const response = await insertOrder({
            nombreCliente,
            metodoPago: Number(metodoPago),
            tipoOrden: Number(tipoOrden),
            productos: selectedProducts.map((p) => ({
                id: p.id,
                quantity: p.quantity,
                ingredientes: p.ingredientes?.map((ing) => ({
                    id: ing.id,
                    checked: (ing as any).checked ?? false,
                })),
            })),
        });

        if (response.success) {
            alert("Orden registrada correctamente!");
            router.push("/dashboard/pedidos/inicio");
        } else {
            alert("Error: " + response.message);
        }
    };

    return (
        <main className="max-w-xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Crear Pedido</h1>

            <label className="block mb-2 font-semibold">Nombre del Cliente</label>
            <input
                type="text"
                value={nombreCliente}
                onChange={(e) => setNombreCliente(e.target.value)}
                className="w-full border p-2 rounded mb-4"
            />

            <button
                onClick={() => setIsModalOpen(true)}
                className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded mb-4 w-full"
            >
                Añadir Productos
            </button>

            {/* Productos seleccionados */}
            <div className="mt-4">
                {selectedProducts.map((prod) => (
                    <div
                        key={prod.id}
                        className="flex justify-between items-center bg-gray-100 p-2 rounded mb-2"
                    >
                        <span>
                            {prod.name} x{prod.quantity} - ₡{prod.price * prod.quantity}
                        </span>
                        <button
                            onClick={() => handleRemoveProduct(prod.id)}
                            className="text-red-500 hover:text-red-700 font-bold"
                        >
                            Quitar
                        </button>
                    </div>
                ))}
            </div>

            <div className="flex gap-4 mt-6">
                <div className="flex-1">
                    <label className="block mb-2 font-semibold">Tipo de pedido</label>
                    <select
                        value={tipoOrden}
                        onChange={(e) => setTipoOrden(e.target.value)}
                        className="w-full border p-2 rounded"
                    >
                        <option value="">Seleccione</option>
                        {tiposOrden.map((t) => (
                            <option key={t.id} value={t.id}>{t.nombre}</option>
                        ))}
                    </select>
                </div>

                <div className="flex-1">
                    <label className="block mb-2 font-semibold">Método de Pago</label>
                    <select
                        value={metodoPago}
                        onChange={(e) => setMetodoPago(e.target.value)}
                        className="w-full border p-2 rounded"
                    >
                        <option value="">Seleccione</option>
                        {metodosPago.map((m) => (
                            <option key={m.id} value={m.id}>{m.nombre}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="flex justify-end mt-6 gap-2">
                <button
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                    onClick={() => {
                        setSelectedProducts([]);
                        setNombreCliente("");
                        setMetodoPago("");
                        setTipoOrden("");
                        router.push("/dashboard/pedidos/inicio");
                    }}
                >
                    Cancelar
                </button>
                <button
                    onClick={handleSubmit}
                    className="bg-[#0DBC7C] hover:bg-emerald-700 text-white px-4 py-2 rounded"
                >
                    Registrar Pedido
                </button>
            </div>

            <AddProductsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAddProduct={handleAddProduct}
            />
        </main>
    );
}