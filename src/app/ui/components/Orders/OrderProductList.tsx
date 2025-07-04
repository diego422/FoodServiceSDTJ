"use client";

type OrderProduct = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

interface OrderProductListProps {
  products: OrderProduct[];
  onRemove: (id: number) => void;
}

/**
* OrderProductList
*
* Component that displays a list of products added to an order.
*
* - Displays the name, quantity, and total per product.
* - Allows you to remove products from the list using a button.
*
* Props:
* - products: List of selected products.
* - onRemove: Function to remove a product by its ID.
*/
export default function OrderProductList({
  products,
  onRemove,
}: OrderProductListProps) {
  return (
    <div className="border p-4 mt-4 rounded">
      <h3 className="font-bold mb-2">Producto/s seleccionado/s:</h3>
      {products.length === 0 && <p>No hay productos agregados.</p>}
      {products.map((prod) => (
        <div
          key={prod.id}
          className="flex justify-between items-center border-b py-2"
        >
          <span>
            {prod.name} x{prod.quantity}
          </span>
          <div className="flex gap-2 items-center">
            <span>₡ {(prod.price * prod.quantity).toLocaleString()}</span>
            <button
              onClick={() => onRemove(prod.id)}
              className="bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded"
            >
              Quitar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
