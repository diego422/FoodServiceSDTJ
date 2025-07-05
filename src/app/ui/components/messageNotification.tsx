/**
 * This component is responsible for show a modal for a success action o a error, this is the MessageNotificacion component.
 */

"use client";

import { useEffect, useState } from "react";

interface Props {
  type: "success" | "error";
  message: string;
}

/**
 * 
 * @param param0 A message which define what type of message is displayed.
 * @returns A modal with two types of messages, green for success and red for error.
 */
export default function MessageNotification({ type, message }: Props) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShow(false);
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  if (!show) return null;

  const bgColor =
    type === "success" ? "bg-green-100 text-green-800 border-green-300" : "bg-red-100 text-red-800 border-red-300";

  return (
    <div className={`fixed top-6 right-6 border px-4 py-2 rounded shadow-lg z-50 ${bgColor}`}>
      {message}
    </div>
  );
}