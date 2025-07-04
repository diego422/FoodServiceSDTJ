"use client";

import { useState, useEffect } from "react";
import PersonalizeModal from "./PersonalizeModal";
import { Product, Categoria, Ingrediente } from "@/lib/typesProducts";
import { getProductosYCategorias, getIngredientesPorProducto } from "@/lib/actions";

interface AddProductsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (product: Product, quantity: number, ingredientes?: Ingrediente[]) => void;
}

/**
* AddProductsModal
*
* Displays a modal for selecting and adding products:
* - Allows you to filter products by text or category.
* - Displays a list of products with price and quantity.
* - Allows you to add simple or custom products with ingredients.
*
* Props:
* - isOpen: Controls whether the modal is visible.
* - onClose: Function to close the modal.
* - onAddProduct: Function to add the selected product.
*/
export default function AddProductsModal({
  isOpen,
  onClose,
  onAddProduct,
}: AddProductsModalProps) {
  const [productos, setProductos] = useState<Product[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [filter, setFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const [isPersonalizeOpen, setIsPersonalizeOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const { productos, categorias } = await getProductosYCategorias();
      setProductos(productos);
      setCategorias(categorias);
    }
    fetchData();
  }, []);

  const handlePersonalize = (product: Product) => {
    setSelectedProduct(product);
    setIsPersonalizeOpen(true);
  };

  const handleAddProduct = async (product: Product) => {
    const ingredientes = await getIngredientesPorProducto(product.id);
    const marcados = ingredientes.map((ing) => ({
      ...ing,
      checked: true,
    }));

    onAddProduct(product, quantity, marcados);
    setQuantity(1);
  };

  const handleAddProductWithIngredientes = (
    product: Product,
    quantity: number,
    ingredientes: Ingrediente[]
  ) => {
    onAddProduct(product, quantity, ingredientes);
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
        <div className="bg-white p-6 rounded w-[90%] max-w-[1100px] max-h-[90vh]">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 max-h-[500px] overflow-y-auto">
            {filteredProducts.map((p) => (
              <div
                key={p.id}
                className="border rounded p-3 shadow flex flex-col justify-between bg-gray-100"
              >
                <span className="font-semibold">{p.name}</span>
                <span className="text-sm text-gray-600">₡{p.price}</span>

                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="border px-2 py-1 rounded mt-2"
                />

                <div className="flex justify-between mt-2">
                  <button
                    className="bg-green-500 text-white px-2 py-1 rounded text-sm"
                    onClick={() => handleAddProduct(p)}
                  >
                    Agregar
                  </button>
                  <button
                    className="bg-yellow-500 text-white px-2 py-1 rounded text-sm"
                    onClick={() => handlePersonalize(p)}
                  >
                    Personalizar
                  </button>
                </div>
              </div>
            ))}
          </div>

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
          onConfirm={(ingredientes) => {
            handleAddProductWithIngredientes(selectedProduct, quantity, ingredientes);
            setIsPersonalizeOpen(false);
          }}
        />
      )}
    </>
  );
}
