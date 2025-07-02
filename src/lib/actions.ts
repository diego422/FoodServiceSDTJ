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
  //---------------------------------------------------------------
  const ingredientesJSON = formData.get("ingredientesJSON")?.toString() || "[]";
  let ingredientes: { id: number; cantidadUso: number }[] = [];

  try {
    ingredientes = JSON.parse(ingredientesJSON);
  } catch (err) {
    console.error("Error al parsear ingredientesJSON", err);
  }
//-------------------------------------------------------------------
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
  //-----------------------------------------------------------------
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

  await Promise.all(
  ingredientes.map((ing) =>
    prisma.products_Ingredients.create({
      data: {
        C_Products: codigoProducto,
        C_Ingredients: ing.id,
        C_Unit_Measurement: 1,
        Q_ConsumptionUnit: new Decimal(ing.cantidadUso),
      },
    })
  )
);
  //-----------------------------------------------------------------
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
    where: { C_Products: codigoProducto },
    include: {
      Category: true,
      InactivationState: true,
      Products_Ingredients: {
        include: {
          Ingredients: {
            include: {
              Unit_Measurement: true,
            },
          },
        },
      },
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
  //-----------------------------------------------------------------
  const ingredientesJSON = formData.get("ingredientesJSON")?.toString() || "[]";
let ingredientes: { id: number; cantidadUso: number }[] = [];

try {
  ingredientes = JSON.parse(ingredientesJSON);
} catch (err) {
  console.error("Error al parsear ingredientesJSON", err);
}
  //-----------------------------------------------------------------
  if (!nombre || !nombreCategoria ) {
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
    },
  });
  //-----------------------------------------------------------------
  await prisma.products_Ingredients.deleteMany({
  where: {
    C_Products: codigoProducto,
  },
});

await Promise.all(
  ingredientes.map((ing) =>
    prisma.products_Ingredients.create({
      data: {
        C_Products: codigoProducto,
        C_Ingredients: ing.id,
        C_Unit_Measurement: 1,
        Q_ConsumptionUnit: new Decimal(ing.cantidadUso),
      },
    })
  )
);
  //-----------------------------------------------------------------

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

/* -------------------------------
   CREAR INGREDIENTE
-------------------------------- */
export async function createIngredients(formData: FormData) {
  const IngredientCode = parseInt(formData.get("codigoIngrediente")?.toString() || "0");
  const IngredientName = formData.get("nombre")?.toString() || "";
  const UnitMeasurementeName = formData.get("nombreUnidadMedida")?.toString() || "";
  const Quantity = parseInt(formData.get("cantidad")?.toString() || "0");
  const StateName = formData.get("nombreEstado")?.toString() || "";

  if (!IngredientCode || !IngredientName || !UnitMeasurementeName || !StateName) {
    console.error("Faltan datos obligatorios.");
    return;
  }

  // Buscar categoría por nombre
  const unitMeasurement = await prisma.unit_Measurement.findFirst({
    where: {
      D_Unit_Measurement_Name: UnitMeasurementeName,
    },
  });

  if (!unitMeasurement) {
    console.error("No existe la unidad de medidad indicada.");
    throw new Error("No existe la unidad de medidad indicada.");
  }

  // Buscar estado por nombre
  const state = await prisma.inactivationState.findFirst({
    where: {
      D_InactivationState: StateName,
    },
  });

  if (!state) {
    console.error("No existe el estado indicado.");
    throw new Error("No existe el estado indicado.");
  }

  // Verificar si ya existe
  const existing = await prisma.ingredients.findUnique({
    where: { C_Ingredients: IngredientCode },
  });

  if (existing) {
    console.error("Ya existe un ingrediente con ese código.");
    throw new Error("Ya existe un ingrediente con ese código.");
  }

  await prisma.ingredients.create({
    data: {
      C_Ingredients: IngredientCode,
      D_Ingredients_Name: IngredientName,
      Q_Quantity: Quantity,
      C_Unit_Measurement: unitMeasurement.C_Unit_Measurement,
      C_InactivationState: state.C_InactivationState,
    },
  });

  revalidatePath("/dashboard/ingredientes/inicio");
  redirect("/dashboard/ingredientes/inicio");
}

/* -------------------------------
   CONSULTAR TODAS LAS UNIDADES DE MEDIDA
-------------------------------- */
export async function fetchUnidadMedidad() {
  return await prisma.unit_Measurement.findMany({
    select: {
      C_Unit_Measurement: true,
      D_Unit_Measurement_Name: true,
    },
  });
}

/* -------------------------------
   CREAR CATEGORÍA
-------------------------------- */
export async function createCategoria(formData: FormData) {
  const codigoCategoria = parseInt(formData.get("codigoCategoria")?.toString() || "0");
  const nombre = formData.get("nombre")?.toString() || "";

  if (!codigoCategoria || !nombre) {
    console.error("Faltan datos obligatorios para la categoría.");
    return;
  }

  // Verificar si ya existe
  const existing = await prisma.category.findUnique({
    where: { C_Category: codigoCategoria },
  });

  if (existing) {
    console.error("Ya existe una categoría con ese código.");
    throw new Error("Ya existe una categoría con ese código.");
  }

  await prisma.category.create({
    data: {
      C_Category: codigoCategoria,
      D_Category_Name: nombre,
    },
  });

  revalidatePath("/dashboard/categorias/inicio");
  redirect("/dashboard/categorias/inicio");
}

/* -------------------------------
   CONSULTAR TODAS LAS CATEGORÍAS
-------------------------------- */
export async function fetchCategoriasAll() {
  return await prisma.category.findMany({
    select: {
      C_Category: true,
      D_Category_Name: true,
    },
  });
}

/* -------------------------------
   CONSULTAR CATEGORÍA POR ID
-------------------------------- */
export async function fetchCategoriaById(codigoCategoria: number) {
  return await prisma.category.findUnique({
    where: {
      C_Category: codigoCategoria,
    },
  });
}

/* -------------------------------
   ACTUALIZAR CATEGORÍA
-------------------------------- */
export async function updateCategoria(codigoCategoria: number, nuevoNombre: string) {
  if (!nuevoNombre) {
    console.error("El nombre de la categoría no puede estar vacío.");
    return;
  }

  await prisma.category.update({
    where: { C_Category: codigoCategoria },
    data: { D_Category_Name: nuevoNombre },
  });

  revalidatePath("/dashboard/categorias/inicio");
}


/* -------------------------------
   CONSULTAR TODOS LOS INGREDIENTES
-------------------------------- */
export async function fetchIngredientsAll() {
  return await prisma.ingredients.findMany({
    where: {
      C_InactivationState: 1,
    },
    include: {
      Unit_Measurement: {
        select: {
          D_Unit_Measurement_Name: true,
        },
      },
    },
  });
}

/* -------------------------------
   ACTUALIZAR INGREDIENTES
-------------------------------- */
export async function updateIngrediente(
  codigoIngrediente: number,
  nuevoNombre: string,
  nuevaUnidad: string,
  nuevaCantidad: number
) {
  const unidad = await prisma.unit_Measurement.findFirst({
    where: {
      D_Unit_Measurement_Name: nuevaUnidad,
    },
  });

  if (!unidad) {
    console.error("La unidad de medida indicada no existe.");
    throw new Error("La unidad de medida indicada no existe.");
  }

  await prisma.ingredients.update({
    where: { C_Ingredients: codigoIngrediente },
    data: {
      D_Ingredients_Name: nuevoNombre,
      C_Unit_Measurement: unidad.C_Unit_Measurement,
      Q_Quantity: new Decimal(nuevaCantidad),
    },
  });

  revalidatePath("/dashboard/ingredientes/inicio");
}

/* -------------------------------
   PEDIDOS
-------------------------------- */

export async function insertOrder(data: {
  nombreCliente: string;
  metodoPago: number;
  tipoOrden: number;
  productos: { id: number; quantity: number }[];
}) {
  try {
    // Ejecutar el procedimiento almacenado
    await prisma.$executeRaw`
      EXEC InsertOrders
        @D_NameClient = ${data.nombreCliente},
        @C_Payment_Method = ${data.metodoPago},
        @C_OrderType = ${data.tipoOrden}
    `;

    // Obtener la orden creada
    const newOrder = await prisma.order.findFirst({
      where: {
        D_NameClient: data.nombreCliente,
      },
      orderBy: {
        C_Order: "desc",
      },
    });

    if (!newOrder) {
      throw new Error("No se pudo recuperar la orden creada");
    }

    // Insertar los detalles de productos
    await prisma.orderDetail.createMany({
      data: data.productos.map((p, index) => ({
        C_Order: newOrder.C_Order,
        C_Order_Detail: index + 1,
        C_Products: p.id,
        Q_Line_Detail_Quantity: p.quantity,
      })),
    });

    return { success: true, orderId: newOrder.C_Order };
  } catch (error) {
    console.error(error);
    return { success: false, error: (error as Error).message };
  }
}
