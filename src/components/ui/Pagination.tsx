import { FC } from "react";
import { NextIcon, Previous } from "./svgs";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageNext: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onPageChange: (page: number) => void;
  onPagePrevious: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
}

export const Pagination: FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageNext,
  onPagePrevious,
  onPageChange,
}) => {
  // Function to generate pagination range with ellipsis for large page counts
  const getPageNumbers = () => {
    const maxPagesToShow = 5; // Limit visible page buttons on smaller screens
    const pages = [];
    const delta = 2; // Number of pages to show around the current page

    if (totalPages <= maxPagesToShow) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const left = Math.max(currentPage - delta, 1);
    const right = Math.min(currentPage + delta, totalPages);
    let pageNumbers: (number | string)[] = [];

    // Always show first page
    pageNumbers.push(1);

    // Add ellipsis if there's a gap between first page and left boundary
    if (left > 2) {
      pageNumbers.push("...");
    }

    // Add pages around current page
    for (let i = left; i <= right; i++) {
      if (i !== 1 && i !== totalPages) {
        pageNumbers.push(i);
      }
    }

    // Add ellipsis if there's a gap between right boundary and last page
    if (right < totalPages - 1) {
      pageNumbers.push("...");
    }

    // Always show last page
    if (totalPages !== 1) {
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  return (
    <div className="nf_leg-pagination flex flex-wrap justify-between items-center text-white mt-5 pb-8 sm:pb-4">
      {/* Previous Button */}
      <button
        className="inline-flex items-center hover:opacity-80 duration-300 gap-2 py-2 px-3 sm:px-4 sm:py-2 prev_btn font-medium text-sm sm:text-base text-custom-gray disabled:opacity-50"
        onClick={onPagePrevious}
        disabled={currentPage === 1}
      >
        <span className="w-5 h-5 sm:w-6 sm:h-6">
          <Previous />
        </span>
        Previous
      </button>

      {/* Page Numbers */}
      <div className="num_of-pagination inline-flex flex-wrap gap-1 sm:gap-2 mx-2 sm:mx-4">
        {getPageNumbers().map((page, index) =>
          typeof page === "string" ? (
            <span
              key={`ellipsis-${index}`}
              className="inline-flex items-center justify-center px-2 py-1 text-sm sm:text-base font-medium text-custom-gray"
            >
              {page}
            </span>
          ) : (
            <button
              key={page}
              className={`inline-flex items-center justify-center font-medium duration-300 text-sm sm:text-base hover:opacity-80 px-2 py-1 sm:px-3 sm:py-1 rounded-md ${
                currentPage === page
                  ? "bg-gradient-to-r from-[#39415C] to-[#555F83] text-white"
                  : "text-custom-gray"
              }`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          )
        )}
      </div>

      {/* Next Button */}
      <button
        className="inline-flex items-center hover:opacity-80 duration-300 gap-2 py-2 px-3 sm:px-4 sm:py-2 next-btn font-medium text-sm sm:text-base text-custom-gray disabled:opacity-50"
        onClick={onPageNext}
        disabled={currentPage === totalPages}
      >
        Next
        <span className="w-5 h-5 sm:w-6 sm:h-6">
          <NextIcon />
        </span>
      </button>

      {/* Inline CSS for Additional Responsiveness */}
      <style jsx>{`
        @media (max-width: 640px) {
          .nf_leg-pagination {
            gap: 0.5rem;
            justify-content: center;
          }
          .num_of-pagination {
            flex-grow: 1;
            justify-content: center;
          }
          .prev_btn,
          .next-btn {
            min-width: 80px;
          }
        }
        @media (max-width: 400px) {
          .prev_btn,
          .next-btn {
            font-size: 0.875rem;
            padding: 0.5rem 0.75rem;
          }
          .num_of-pagination button,
          .num_of-pagination span {
            font-size: 0.875rem;
            padding: 0.5rem 0.75rem;
          }
        }
      `}</style>
    </div>
  );
};
