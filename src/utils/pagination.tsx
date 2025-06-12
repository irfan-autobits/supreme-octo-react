// src/utils/pagination.ts

/**
 * Simple helper to paginate an array.
 * - data: the full array
 * - currentPage: 1-based page index
 * - itemsPerPage: number of items in each page
 *
 * Returns:
 *   currentPageItems: the slice of data for this page
 *   totalPages: how many pages exist in total
 */
export function getPagedData<T>(
  data: T[],
  currentPage: number,
  itemsPerPage: number
): { currentPageItems: T[]; totalPages: number } {
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageItems = data.slice(startIndex, endIndex);
  return { currentPageItems, totalPages };
}
