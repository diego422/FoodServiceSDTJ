"use client";

import { useState } from "react";
import PersonalizeModal from "./PersonalizeModal";
import { Product, Categoria, Ingrediente } from "@/lib/typesProducts";

interface AddProductsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (product: Product, quantity: number, ingredientes?: Ingrediente[]) => void;
  productos: Product[];
  categorias: Categoria[];
}

export default function AddProductsModal({
  isOpen,
  onClose,
  onAddProduct,
  productos,
  categorias,
}: AddProductsModalProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [filter, setFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const [isPersonalizeOpen, setIsPersonalizeOpen] = useState(false);

  const handlePersonalize = (product: Product) => {
    setSelectedProduct(product);
    setIsPersonalizeOpen(true);
  };

  const handleAddProduct = (product: Product) => {
    onAddProduct(product, quantity);
    setQuantity(1);
  };

  const filteredProducts = productos.filter((p) => {
    return (
      (filter === "" || p.name.toLowerCase().includes(filter.toLowerCase())) &&
      (categoryFilter === "" || p.category === categoryFilter)
    );
  });

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded w-[400px]">
          <h2 className="text-lg font-bold mb-4">Añadir Productos</h2>

          <input
            type="text"
            placeholder="Buscar producto..."
            className="border p-2 w-full mb-2"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />

          <select
            className="border p-2 w-full mb-4"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">Todas las categorías</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.nombre}>
                {cat.nombre}
              </option>
            ))}
          </select>

          {filteredProducts.map((p) => (
            <div key={p.id} className="flex items-center justify-between mb-3">
              <span>{p.name} - ₡{p.price}</span>
              <div className="flex gap-2">
                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-16 border px-2 py-1 rounded"
                />
                <button
                  className="bg-green-500 text-white px-3 py-1 rounded"
                  onClick={() => handleAddProduct(p)}
                >
                  Agregar
                </button>
                <button
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                  onClick={() => handlePersonalize(p)}
                >
                  Personalizar
                </button>
              </div>
            </div>
          ))}

          <button
            onClick={onClose}
            className="mt-4 bg-gray-400 text-white px-4 py-2 rounded w-full"
          >
            Cerrar
          </button>
        </div>
      </div>

      {isPersonalizeOpen && selectedProduct && (
        <PersonalizeModal
          producto={selectedProduct}
          onClose={() => setIsPersonalizeOpen(false)}
        />
      )}
    </>
  );
}
