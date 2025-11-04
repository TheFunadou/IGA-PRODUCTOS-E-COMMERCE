import clsx from 'clsx';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
};

const PaginationComponent = ({ currentPage, totalPages, onPageChange }: Props) => {
    const getPageNumbers = (): (number | string)[] => {
        const pages: (number | string)[] = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push('...');
                pages.push(currentPage - 1);
                pages.push(currentPage);
                pages.push(currentPage + 1);
                pages.push('...');
                pages.push(totalPages);
            }
        }

        return pages;
    };

    return (
        <div className="flex gap-2">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Página anterior"
            >
                <ChevronLeft size={20} />
            </button>

            {getPageNumbers().map((page, idx) => (
                page === '...' ? (
                    <span key={`ellipsis-${idx}`} className="px-3 py-2 text-gray-500">
                        ...
                    </span>
                ) : (
                    <button
                        key={page}
                        onClick={() => onPageChange(page as number)}
                        className= {clsx(
                            "px-4 py-2 rounded-xl border transition-colors",
                            currentPage === page ? "bg-primary text-white border-blue-600": "border-gray-300 hover:bg-gray-100"
                        )}
                        aria-label={`Página ${page}`}
                        aria-current={currentPage === page ? 'page' : undefined}
                    >
                        {page}
                    </button>
                )
            ))}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Página siguiente"
            >
                <ChevronRight size={20} />
            </button>
        </div>
    );
};

export default PaginationComponent;