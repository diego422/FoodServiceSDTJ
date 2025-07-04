'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

type SearchProps = {
  placeholder: string;
  paramName?: string;
};


/**
 * Search
 *
 * A client-side search input component.
 *
 * - Captures the user's text input.
 * - Updates the URL query string with a search term.
 * - Automatically debounces typing (waits 300ms before triggering search).
 * - Resets pagination to page 1 when a new search is performed.
 *
 * Props:
 * @param placeholder - Text shown inside the input as a hint.
 * @param paramName - Query string key to store the search term (default: "query").
 *
 */
export default function Search({
  placeholder,
  paramName = 'query',
}: SearchProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');

    if (term) {
      params.set(paramName, term);
    } else {
      params.delete(paramName);
    }

    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Buscar
      </label>
      <input
        id="search"
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get(paramName)?.toString() || ''}
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}