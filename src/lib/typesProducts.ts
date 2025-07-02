// src/lib/typesProducts.ts

export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

export interface Categoria {
  id: number;
  nombre: string;
}

export interface Ingrediente {
  id: number;
  nombre: string;
  checked?: boolean;
}
