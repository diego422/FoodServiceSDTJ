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

  const categoria = await prisma.category.findFirst({
    where: {
      D_Category_Name: nombreCategoria,
    },
  });

  if (!categoria) {
    console.error("No existe la categoría indicada.");
    throw new Error("No existe la categoría indicada.");
  }

  const estado = await prisma.inactivationState.findFirst({
    where: {
      D_InactivationState: nombreEstado,
    },
  });

  if (!estado) {
    console.error("No existe el estado indicado.");
    throw new Error("No existe el estado indicado.");
  }

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
  if (!nombre || !nombreCategoria) {
    console.error("Faltan datos obligatorios para actualizar.");
    return;
  }

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
   INACTIVAR PRODUCTO
-------------------------------- */

export async function inactivateProduct(codigoProducto: number) {
  try {
    await prisma.products.update({
      where: { C_Products: codigoProducto },
      data: {
        C_InactivationState: 0,
      },
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: "Error al inactivar el producto" };
  }
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

  const unitMeasurement = await prisma.unit_Measurement.findFirst({
    where: {
      D_Unit_Measurement_Name: UnitMeasurementeName,
    },
  });

  if (!unitMeasurement) {
    console.error("No existe la unidad de medidad indicada.");
    throw new Error("No existe la unidad de medidad indicada.");
  }

  const state = await prisma.inactivationState.findFirst({
    where: {
      D_InactivationState: StateName,
    },
  });

  if (!state) {
    console.error("No existe el estado indicado.");
    throw new Error("No existe el estado indicado.");
  }

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
  productos: {
    id: number;
    quantity: number;
    ingredientes?: { id: number; checked: boolean }[];
  }[];
}) {
  try {
    console.log("Insertando orden con datos:");
    console.log(JSON.stringify(data, null, 2));

    await prisma.$executeRaw`
      EXEC InsertOrders
        @D_NameClient = ${data.nombreCliente},
        @C_Payment_Method = ${data.metodoPago},
        @C_OrderType = ${data.tipoOrden}
    `;

    const newOrder = await prisma.order.findFirst({
      where: { D_NameClient: data.nombreCliente },
      orderBy: { C_Order: "desc" },
    });

    if (!newOrder) {
      throw new Error("No se pudo recuperar la orden creada.");
    }

    for (const p of data.productos) {

      const detail = await prisma.orderDetail.create({
        data: {
          C_Order: newOrder.C_Order,
          C_Products: p.id,
          Q_Line_Detail_Quantity: p.quantity,
        },
      });

      if (p.ingredientes && p.ingredientes.length > 0) {
        const ingredientesUnicos = Object.values(
          Object.fromEntries(p.ingredientes.map((ing) => [ing.id, ing]))
        );

        const insertados = new Set<string>();

        for (const ing of ingredientesUnicos) {
          const key = `${detail.C_Order_Detail}_${ing.id}`;
          if (insertados.has(key)) continue;
          insertados.add(key);

          const isUsed =
            typeof ing.checked === "boolean"
              ? ing.checked
              : String(ing.checked).toLowerCase() === "true";

          const exists = await prisma.order_Ingredients.findFirst({
            where: {
              C_Order_Detail: detail.C_Order_Detail,
              C_Ingredients: ing.id,
            },
          });

          if (!exists) {
            console.log("Insertando ingrediente:", {
              order: newOrder.C_Order,
              detail: detail.C_Order_Detail,
              ingredient: ing.id,
              checked: ing.checked,
              finalIsUsed: isUsed,
            });

            

            await prisma.order_Ingredients.create({
              data: {
                C_Order: newOrder.C_Order,
                C_Order_Detail: detail.C_Order_Detail,
                C_Products: p.id,
                C_Ingredients: ing.id,
                IsUsed: isUsed,
              },
            });
          }
        }
      }
    }

    return { success: true, orderId: newOrder.C_Order };
  } catch (error) {
    console.error("Error al insertar orden:", error);
    return {
      success: false,
      error: (error as Error).message || "Error desconocido",
    };
  }
}


/* -------------------------------
   CIERRE DE CAJA
-------------------------------- */

export async function getOpenBoxForToday() {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);

  return await prisma.box.findFirst({
    where: {
      F_OpenDateTime: { gte: today, lt: tomorrow },
      F_CloseDateTime: null,
    },
  });
}


export async function openNewBox(formData: FormData) {
  const raw = formData.get("montoInicial");
  const monto = parseFloat(raw as string);

  if (isNaN(monto) || monto < 0) {
    throw new Error("Monto inválido");
  }

  await prisma.$executeRawUnsafe(`EXEC OpenBox @MontoInicial = ${monto}`);

  redirect('/dashboard/cierreCaja/inicio');
}

export async function getBoxForToday() {
  const now = new Date();

  const startOfDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    0, 0, 0, 0
  );

  const endOfDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
    0, 0, 0, 0
  );

  return prisma.box.findFirst({
    where: {
      F_OpenDateTime: {
        gte: startOfDay,
        lt: endOfDay,
      },
    },
    orderBy: {
      F_OpenDateTime: "desc",
    },
  });
}



export async function closeCaja(formData: FormData) {
  const boxId = Number(formData.get('boxId'));

  if (!boxId) throw new Error("ID de caja no válido.");

  await prisma.$executeRawUnsafe(`EXEC CloseBox ${boxId}`);

  redirect('/dashboard/cierreCaja/inicio');
}

export async function openBoxStoredProcedure(montoInicial: number) {
  return await prisma.$executeRawUnsafe(`EXEC OpenBox @MontoInicial = ${montoInicial}`);
}


/* -------------------------------
   Ingredientes
-------------------------------- */


export async function getIngredientesPorProducto(productId: number) {
  const ingredientes = await prisma.products_Ingredients.findMany({
    where: {
      C_Products: productId,
    },
    include: {
      Ingredients: true,
    },
  });

  return ingredientes.map((i) => ({
    id: i.C_Ingredients,
    nombre: i.Ingredients.D_Ingredients_Name,
    checked: false,
  }));
}


export async function getProductosYCategorias() {
  const productos = await prisma.products.findMany({
    include: {
      Category: true,
    },
  });

  const categorias = await prisma.category.findMany();

  return {
    productos: productos.map(p => ({
      id: p.C_Products,
      name: p.D_Name,
      price: p.M_Price.toNumber(),
      category: p.Category?.D_Category_Name || "Sin categoría",
    })),
    categorias: categorias.map(c => ({
      id: c.C_Category,
      nombre: c.D_Category_Name,
    })),
  };
}


//----------------------------------------------------------------------

export async function getOrderById(id: number) {
  try {
    const order = await prisma.order.findUnique({
      where: { C_Order: id },
      include: {
        OrderDetail: {
          include: {
            Products: true,
            Ingredients_Products: {
              include: {
                Ingredients: true,
              },
            },
          },
        },
        PaymentMethod: true,
        OrderType: true,
        StateType: true,
      },
    });

    if (!order) return null;

    return {
      nombreCliente: order.D_NameClient || "",
      metodoPago: order.C_Payment_Method || 0,
      tipoOrden: order.C_OrderType || 0,
      estado: order.C_State_Type || 1,
      productos: order.OrderDetail.map((od) => ({
        id: od.Products.C_Products,
        name: od.Products.D_Name,
        price: Number(od.Products.M_Price),
        quantity: od.Q_Line_Detail_Quantity,
        ingredientes: od.Ingredients_Products.map((ip) => ({
          id: ip.C_Ingredients,
          nombre: ip.Ingredients.D_Ingredients_Name,
          checked: ip.IsUsed === true,
        })),
      })),
    };
  } catch (error) {
    console.error("Error al obtener la orden:", error);
    return null;
  }
}

export async function updateOrderState(id: number, estado: number) {
  try {
    await prisma.order.update({
      where: { C_Order: id },
      data: { C_State_Type: estado },
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: "Error al actualizar estado: " + error.message };
  }
}

export async function updateOrder(orderId: number, data: {
  nombreCliente: string;
  metodoPago: number;
  tipoOrden: number;
  productos: {
    id: number;
    quantity: number;
    ingredientes?: { id: number; checked: boolean }[];
  }[];
}) {
  try {
    if (data.productos.length === 0) {
      return { success: false, error: "No se puede guardar una orden sin productos." };
    }

    await prisma.orderDetail.deleteMany({ where: { C_Order: orderId } });
    await prisma.order_Ingredients.deleteMany({ where: { C_Order: orderId } });

    await prisma.order.update({
      where: { C_Order: orderId },
      data: {
        D_NameClient: data.nombreCliente,
        C_OrderType: data.tipoOrden,
        C_Payment_Method: data.metodoPago,
        F_Payment_Date: new Date(),
      },
    });

    for (const p of data.productos) {
      const detail = await prisma.orderDetail.create({
        data: {
          C_Order: orderId,
          C_Products: p.id,
          Q_Line_Detail_Quantity: p.quantity,
        },
      });

      if (p.ingredientes && p.ingredientes.length > 0) {
        for (const ing of p.ingredientes) {
          await prisma.order_Ingredients.create({
            data: {
              C_Order: orderId,
              C_Order_Detail: detail.C_Order_Detail,
              C_Products: p.id,
              C_Ingredients: ing.id,
              IsUsed: ing.checked,
            },
          });
        }
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Error al actualizar orden:", error);
    return { success: false, error: "No se pudo actualizar la orden" };
  }
}

export async function fetchTiposOrden() {
  const tipos = await prisma.orderType.findMany();
  return tipos.map(t => ({
    id: t.C_OrderType,
    nombre: t.D_OrderType,
  }));
}

export async function fetchMetodosPago() {
  const metodos = await prisma.paymentMethod.findMany();
  return metodos.map(m => ({
    id: m.C_Payment_Method,
    nombre: m.D_Payment_Method_Name,
  }));
}

export async function fetchEstados() {
  const estados = await prisma.stateType.findMany();
  return estados.map(e => ({
    id: e.C_State_Type,
    nombre: e.D_State_Type,
  }));
}