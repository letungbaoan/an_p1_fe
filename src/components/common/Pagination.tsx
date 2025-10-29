import React, { useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const MAX_VISIBLE_PAGES = 5

  const pageNumbers = useMemo(() => {
    const pages: number[] = []

    if (totalPages <= MAX_VISIBLE_PAGES) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      const startPage = Math.max(2, currentPage - 1)
      const endPage = Math.min(totalPages - 1, currentPage + 1)

      pages.push(1)

      if (startPage > 2) {
        pages.push(-1)
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
      }

      if (endPage < totalPages - 1) {
        pages.push(-1)
      }

      if (!pages.includes(totalPages)) {
        pages.push(totalPages)
      }
    }

    return pages.filter((p, index, self) => p !== -1 || self[index - 1] !== -1)
  }, [totalPages, currentPage, MAX_VISIBLE_PAGES])

  const renderPageButton = (page: number, index: number) => {
    if (page === -1) {
      return (
        <span key={`ellipsis-${index}`} className='px-3 py-2 text-gray-500'>
          ...
        </span>
      )
    }

    const isActive = page === currentPage

    const baseClasses = 'px-4 py-2 mx-1 border rounded-md transition duration-150'
    const activeClasses = 'bg-purple-600 text-white border-purple-600 font-semibold shadow-md'
    const inactiveClasses = 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'

    return (
      <button
        key={page}
        onClick={() => onPageChange(page)}
        disabled={isActive}
        className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
      >
        {page}
      </button>
    )
  }

  if (totalPages <= 1) {
    return null
  }

  return (
    <div className='flex items-center justify-center space-x-2'>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className='rounded-md border bg-white px-3 py-2 text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50'
      >
        <ChevronLeft size={18} />
      </button>

      <div className='flex'>{pageNumbers.map(renderPageButton)}</div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className='rounded-md border bg-white px-3 py-2 text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50'
      >
        <ChevronRight size={18} />
      </button>
    </div>
  )
}

export default Pagination
