"use client";

import React from "react";

export interface Column<T> {
  key: keyof T;
  label: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
}

/**
* DataTable
*
* Renders a generic table:
* - Displays dynamic data in rows and columns.
* - Allows custom columns to be rendered.
*
* Props:
* @param columns - Definition of columns and labels.
* @param data - Data to display (array of objects).
*/
export default function DataTable<T extends Record<string, any>>({
  columns,
  data,
}: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-lg shadow border border-gray-200 dark:border-gray-700">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-100 dark:bg-gray-800 dark:text-gray-100 uppercase text-xs font-semibold">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className="px-6 py-3 text-left border-b border-gray-300 dark:border-gray-700"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, idx) => (
            <tr
              key={idx}
              className={
                idx % 2 === 0
                  ? "bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-700"
                  : "bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
              }
            >
              {columns.map((col) => (
                <td
                  key={String(col.key)}
                  className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200"
                >
                  {col.render
                    ? col.render(item[col.key], item)
                    : String(item[col.key] ?? "No disponible")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
