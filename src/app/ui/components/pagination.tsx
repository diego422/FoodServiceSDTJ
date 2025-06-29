"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
};

export default function Pagination({
  currentPage,
  totalPages,
}: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(page));
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex justify-center mt-6">
      <nav className="inline-flex">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-2 border border-gray-400 dark:border-gray-600 rounded-l ${
            currentPage === 1
              ? "bg-gray-300 cursor-not-allowed"
              : "hover:bg-green-600 hover:text-white transition"
          }`}
        >
          &lt;
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => goToPage(page)}
            className={`px-3 py-2 border border-gray-400 dark:border-gray-600 ${
              currentPage === page
                ? "bg-green-600 text-white"
                : "hover:bg-green-600 hover:text-white transition"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-2 border border-gray-400 dark:border-gray-600 rounded-r ${
            currentPage === totalPages
              ? "bg-gray-300 cursor-not-allowed"
              : "hover:bg-green-600 hover:text-white transition"
          }`}
        >
          &gt;
        </button>
      </nav>
    </div>
  );
}
