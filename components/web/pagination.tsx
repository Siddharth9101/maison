"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationProps {
  page: number;
  totalPages: number;
}

export function PaginationComp({ page, totalPages }: PaginationProps) {
  return (
    <Pagination className="mt-10" role="navigation" aria-label="Pagination Navigation">
      <PaginationContent>
        {page > 1 && (
          <PaginationItem>
            <PaginationPrevious
              href={`/products?page=${page - 1}`}
              aria-label={`Go to page ${page - 1}`}
            />
          </PaginationItem>
        )}

        {Array.from({ length: totalPages }).map((_, i) => {
          const pageNumber = i + 1;
          const isActive = page === pageNumber;

          return (
            <PaginationItem key={pageNumber}>
              <PaginationLink
                href={`/products?page=${pageNumber}`}
                isActive={isActive}
                aria-label={`${isActive ? "Current page" : "Go to page"} ${pageNumber}`}
                aria-current={isActive ? "page" : undefined}
              >
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        {page < totalPages && (
          <PaginationItem>
            <PaginationNext
              href={`/products?page=${page + 1}`}
              aria-label={`Go to page ${page + 1}`}
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}
