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
  const codigoCategoria = parseInt(formData.get("codigoCategoria")?.toString() || "0");
  const precio = parseFloat(formData.get("precio")?.toString() || "0.00");
  const cantidad = parseInt(formData.get("cantidad")?.toString() || "0");

  if (!codigoProducto || !nombre) {
    console.error("Faltan datos obligatorios");
    return;
  }

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
      C_Category: codigoCategoria,
      M_Price: precio,
      N_Quantity: cantidad,
    },
  });

  revalidatePath("/dashboard/productos/inicio");
  redirect("/dashboard/productos/inicio");
}

/* -------------------------------
   CONSULTAR PRODUCTO POR ID
-------------------------------- */
export async function fetchProductoById(codigoProducto: number) {
  const producto = await prisma.products.findUnique({
    where: {
      C_Products: codigoProducto,
    },
  });

  return producto;
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
  const codigoCategoria = parseInt(formData.get("codigoCategoria")?.toString() || "0");
  const precio = parseFloat(formData.get("precio")?.toString() || "0.00");
  const cantidad = parseInt(formData.get("cantidad")?.toString() || "0");

  if (!nombre) {
    console.error("Faltan datos obligatorios para actualizar.");
    return;
  }

  await prisma.products.update({
    where: {
      C_Products: codigoProducto,
    },
    data: {
      D_Name: nombre,
      D_Description: descripcion,
    //   C_Category: codigoCategoria,
       M_Price: new Decimal(precio),
      N_Quantity: cantidad,
    },
  });

  revalidatePath("/dashboard/productos/inicio");
  redirect("/dashboard/productos/inicio");
}
