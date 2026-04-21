import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { type Pagination as PaginationType } from '../services/topicsService';

interface PaginationProps {
  pagination: PaginationType;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({ 
  pagination, 
  onPageChange,
  isLoading = false 
}) => {
  const { currentPage, totalPages, totalItems } = pagination;

  if (totalPages <= 1) return null;

  const renderPageButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          disabled={isLoading || i === currentPage}
          className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
            i === currentPage
              ? 'bg-primary-600 text-white shadow-md shadow-primary-200 dark:shadow-none'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700'
          } disabled:opacity-50`}
        >
          {i}
        </button>
      );
    }
    return buttons;
  };

  return (
    <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 py-4 border-t border-slate-100 dark:border-slate-800">
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Showing <span className="font-semibold text-slate-700 dark:text-slate-200">{totalItems > 0 ? (currentPage - 1) * pagination.perPage + 1 : 0}</span> to{' '}
        <span className="font-semibold text-slate-700 dark:text-slate-200">
          {Math.min(currentPage * pagination.perPage, totalItems)}
        </span>{' '}
        of <span className="font-semibold text-slate-700 dark:text-slate-200">{totalItems}</span> entries
      </p>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={isLoading || currentPage === 1}
          className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="flex items-center gap-1">
          {renderPageButtons()}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={isLoading || currentPage === totalPages}
          className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Next page"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};
