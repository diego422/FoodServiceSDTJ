/**
 * This component is the responsible for show a window with a error, this is the ModalErrorCategory.
 * 
 */

"use client";

import { useEffect, useState } from "react";

interface Props {
  error?: string;
}
 /**
  * This function works with an useState and the useEffect for view the error, if is true show a message 
  * with the error name.
  * @param param0 The variable sended for the categorias page.
  * @returns A modal with the error.
  */
export default function ModalErrorCategory({ error }: Props) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (error === "categoria_existente") {
      setShow(true);
      setTimeout(() => setShow(false), 3000);
    }
  }, [error]);

  if (!show) return null;

  return (
    <div className="fixed top-6 right-6 bg-red-100 text-red-800 border border-red-300 px-4 py-2 rounded shadow-lg z-50">
      La categoría ya existe en el sistema.
    </div>
  );
}
