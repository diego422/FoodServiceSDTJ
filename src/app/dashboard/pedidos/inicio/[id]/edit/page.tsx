"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AddProductsModal from "@/app/ui/components/Orders/AddProductsModal";
import PersonalizeModal from "@/app/ui/components/Orders/PersonalizeModal";
import {
  getOrderById,
  updateOrder,
  updateOrderState,
  fetchEstados,
  fetchMetodosPago,
  fetchTiposOrden,
} from "@/lib/actions";
import { Product, Ingrediente } from "@/lib/typesProducts";

/**
 * Client page for editing an order.
 *
 * - Fetches an order's details by ID:
 *    - customer name
 *    - products and their ingredients
 *    - order type, payment method, and state
 * - Allows:
 *    - editing customer name
 *    - adding/removing products
 *    - customizing product ingredients
 *    - updating order type, payment method, and state
 *    - saving changes or marking the order as completed
 * - Integrates modals for adding and personalizing products.
 *
 * @returns JSX rendering the edit-order UI.
 */
export default function EditOrderPage() {
  const { id } = useParams();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPersonalizeOpen, setIsPersonalizeOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<number | null>(null);

  const [selectedProducts, setSelectedProducts] = useState<
    { id: number; name: string; price: number; quantity: number; ingredientes?: Ingrediente[] }[]
  >([]);
  const [nombreCliente, setNombreCliente] = useState("");
  const [tipoOrden, setTipoOrden] = useState("");
  const [metodoPago, setMetodoPago] = useState("");
  const [estado, setEstado] = useState("");

  const [tiposOrden, setTiposOrden] = useState<{ id: number; nombre: string }[]>([]);
  const [metodosPago, setMetodosPago] = useState<{ id: number; nombre: string }[]>([]);
  const [estados, setEstados] = useState<{ id: number; nombre: string }[]>([]);

  useEffect(() => {
    async function fetchData() {
      const [tipos, metodos, estados] = await Promise.all([
        fetchTiposOrden(),
        fetchMetodosPago(),
        fetchEstados(),
      ]);
      setTiposOrden(tipos);
      setMetodosPago(metodos);
      setEstados(estados);
    }

    fetchData();
  }, []);

  useEffect(() => {
    async function fetchOrder() {
      const order = await getOrderById(Number(id));
      if (!order) return router.push("/dashboard/pedidos/inicio");

      setNombreCliente(order.nombreCliente);
      setMetodoPago(order.metodoPago.toString());
      setTipoOrden(order.tipoOrden.toString());
      setEstado(order.estado.toString());
      setSelectedProducts(
        order.productos.map((p: any) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          quantity: p.quantity,
          ingredientes: p.ingredientes,
        }))
      );
      setIsLoading(false);
    }

    fetchOrder();
  }, [id, router]);

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

  const handlePersonalizeExisting = (id: number) => {
    setProductToEdit(id);
    setIsPersonalizeOpen(true);
  };

  const handleConfirmPersonalize = (ingredientes: Ingrediente[]) => {
    if (productToEdit === null) return;
    setSelectedProducts((prev) =>
      prev.map((p) =>
        p.id === productToEdit ? { ...p, ingredientes } : p
      )
    );
    setIsPersonalizeOpen(false);
    setProductToEdit(null);
  };

  const handleSubmit = async () => {
    const response = await updateOrder(Number(id), {
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
      alert("Orden actualizada correctamente!");
      router.push("/dashboard/pedidos/inicio");
    } else {
      alert("Error: " + response.error);
    }
  };

  const handleChangeToFinalizado = async () => {
    const response = await updateOrderState(Number(id), 3);
    if (response.success) {
      alert("Orden marcada como Finalizada");
      setEstado("3");
       router.push("/dashboard/pedidos/inicio");
    } else {
      alert("Error: " + response.error);
    }
  };

  if (isLoading) return <p className="p-6">Cargando...</p>;

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Modificar Pedido</h1>

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

      <div className="mt-4">
        {selectedProducts.map((prod) => (
          <div
            key={prod.id}
            className="flex justify-between items-center bg-gray-100 p-2 rounded mb-2"
          >
            <span>
              {prod.name} x{prod.quantity} - ₡{prod.price * prod.quantity}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handlePersonalizeExisting(prod.id)}
                className="text-yellow-600 hover:underline text-sm"
              >
                Personalizar
              </button>
              <button
                onClick={() => handleRemoveProduct(prod.id)}
                className="text-red-500 hover:text-red-700 font-bold"
              >
                Quitar
              </button>
            </div>
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

      <div className="flex justify-between mt-6">
        <button
          onClick={handleChangeToFinalizado}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded"
        >
          Marcar como Finalizado
        </button>

        <div className="flex gap-2">
          <button
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
            onClick={() => router.push("/dashboard/pedidos/inicio")}
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded"
          >
            Guardar Cambios
          </button>
        </div>
      </div>

      <AddProductsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddProduct={handleAddProduct}
      />

      {isPersonalizeOpen && productToEdit !== null && (
        <PersonalizeModal
          producto={{
            id: selectedProducts.find((p) => p.id === productToEdit)?.id || 0,
            name: selectedProducts.find((p) => p.id === productToEdit)?.name || "",
            price: 0,
            category: "",
          }}
          onClose={() => setIsPersonalizeOpen(false)}
          onConfirm={handleConfirmPersonalize}
        />
      )}
    </main>
  );
}