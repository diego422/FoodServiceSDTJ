"use server";

import prisma from "./prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Decimal } from "@prisma/client/runtime/library";

/* -------------------------------
   CREAR PRODUCTO
-------------------------------- */
export async function createProducto(formData: FormData) {
  const codigoProducto = parseInt(formData.get("codigoProducto")?.toString() || "0");
  const nombre = formData.get("nombre")?.toString() || "";
  const descripcion = formData.get("descripcion")?.toString() || "";
  const nombreCategoria = formData.get("nombreCategoria")?.toString() || "";
  const precio = parseFloat(formData.get("precio")?.toString() || "0.00");
  const cantidad = parseInt(formData.get("cantidad")?.toString() || "0");
  const nombreEstado = formData.get("nombreEstado")?.toString() || "";

  if (!codigoProducto || !nombre || !nombreCategoria || !nombreEstado) {
    console.error("Faltan datos obligatorios.");
    return;
  }

  // Buscar categoría por nombre
  const categoria = await prisma.category.findFirst({
    where: {
      D_Category_Name: nombreCategoria,
    },
  });

  if (!categoria) {
    console.error("No existe la categoría indicada.");
    throw new Error("No existe la categoría indicada.");
  }

  // Buscar estado por nombre
  const estado = await prisma.inactivationState.findFirst({
    where: {
      D_InactivationState: nombreEstado,
    },
  });

  if (!estado) {
    console.error("No existe el estado indicado.");
    throw new Error("No existe el estado indicado.");
  }

  // Verificar si ya existe
  const existing = await prisma.products.findUnique({
    where: { C_Products: codigoProducto },
  });

  if (existing) {
    console.error("Ya existe un producto con ese código.");
    throw new Error("Ya existe un producto con ese código.");
  }

  await prisma.products.create({
    data: {
      C_Products: codigoProducto,
      D_Name: nombre,
      D_Description: descripcion,
      C_Category: categoria.C_Category,
      M_Price: precio,
      N_Quantity: cantidad,
      C_InactivationState: estado.C_InactivationState,
    },
  });

  revalidatePath("/dashboard/productos/inicio");
  redirect("/dashboard/productos/inicio");
}

/* -------------------------------
   CONSULTAR TODOS LOS PRODUCTOS
-------------------------------- */
export async function fetchProductos() {
  return await prisma.products.findMany({
    include: {
      Category: true,
      InactivationState: true,
    },
  });
}

/* -------------------------------
   CONSULTAR PRODUCTO POR ID
-------------------------------- */
export async function fetchProductoById(codigoProducto: number) {
  return await prisma.products.findUnique({
    where: {
      C_Products: codigoProducto,
    },
    include: {
      Category: true,
      InactivationState: true,
    },
  });
}

/* -------------------------------
   ACTUALIZAR PRODUCTO
-------------------------------- */
export async function updateProducto(
  codigoProducto: number,
  formData: FormData
) {
  const nombre = formData.get("nombre")?.toString() || "";
  const descripcion = formData.get("descripcion")?.toString() || "";
  const nombreCategoria = formData.get("nombreCategoria")?.toString() || "";
  const precio = parseFloat(formData.get("precio")?.toString() || "0.00");
  const cantidad = parseInt(formData.get("cantidad")?.toString() || "0");
  const nombreEstado = formData.get("nombreEstado")?.toString() || "";

  if (!nombre || !nombreCategoria || !nombreEstado) {
    console.error("Faltan datos obligatorios para actualizar.");
    return;
  }

  // Buscar categoría por nombre
  const categoria = await prisma.category.findFirst({
    where: {
      D_Category_Name: nombreCategoria,
    },
  });

  if (!categoria) {
    console.error("No existe la categoría indicada.");
    throw new Error("No existe la categoría indicada.");
  }

  // Buscar estado por nombre
  const estado = await prisma.inactivationState.findFirst({
    where: {
      D_InactivationState: nombreEstado,
    },
  });

  if (!estado) {
    console.error("No existe el estado indicado.");
    throw new Error("No existe el estado indicado.");
  }

  await prisma.products.update({
    where: {
      C_Products: codigoProducto,
    },
    data: {
      D_Name: nombre,
      D_Description: descripcion,
      C_Category: categoria.C_Category,
      M_Price: new Decimal(precio),
      N_Quantity: cantidad,
      C_InactivationState: estado.C_InactivationState,
    },
  });

  revalidatePath("/dashboard/productos/inicio");
  redirect("/dashboard/productos/inicio");
}

/* -------------------------------
   CONSULTAR TODAS LAS CATEGORÍAS
-------------------------------- */
export async function fetchCategorias() {
  return await prisma.category.findMany({
    select: {
      C_Category: true,
      D_Category_Name: true,
    },
  });
}

/* -------------------------------
   CONSULTAR TODOS LOS ESTADOS
-------------------------------- */
export async function fetchInactivationStates() {
  return await prisma.inactivationState.findMany({
    select: {
      C_InactivationState: true,
      D_InactivationState: true,
    },
  });
}
