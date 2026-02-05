'use client'

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

interface PaginationControlProps {
  currentPage: number
  hasNextPage: boolean
  onPageChange: (page: number) => void
  itemCount: number
  pageSize: number
}

export function PaginationControl({
  currentPage,
  hasNextPage,
  onPageChange,
  itemCount,
  pageSize,
}: PaginationControlProps) {
  return (
    <div className="flex flex-col items-center gap-4 mt-6 pt-4 border-t border-slate-700">
      <p className="text-sm text-slate-400">
        Page {currentPage} - Showing {itemCount} items
      </p>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              href="#"
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink
              href="#"
              isActive
              className="bg-slate-700 text-white border-slate-600"
            >
              {currentPage}
            </PaginationLink>
          </PaginationItem>
          {hasNextPage && (
            <PaginationItem>
              <PaginationLink href="#" className="text-slate-300 border-slate-600">
                {currentPage + 1}
              </PaginationLink>
            </PaginationItem>
          )}
          <PaginationItem>
            <PaginationNext
              onClick={() => hasNextPage && onPageChange(currentPage + 1)}
              className={!hasNextPage ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              href="#"
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
