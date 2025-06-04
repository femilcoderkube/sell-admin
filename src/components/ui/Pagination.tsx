import { FC } from "react";
import { NextIcon, Previous } from "./svgs";
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageNext: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onPageChange: (page: number) => void;
  onPagePrvious: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
}
export const Pagination: FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageNext,
  onPagePrvious,
  onPageChange,
}) => {
  return (
    <div className="nf_leg-pagination flex justify-between items-center text-white mt-5 pb-[2rem]">
      <button
        className="inline-flex hover:opacity-80 duration-300 gap-2 py-1 px-2 prev_btn font-medium text-[1.0625rem] text-custom-gray"
        onClick={onPagePrvious}
        disabled={currentPage === 1}
      >
        <span>
          <Previous />
        </span>
        Previous
      </button>
      <div className="num_of-pagination inline-flex gap-2">
        {Array.from({ length: totalPages }, (_, index) => index + 1).map(
          (page) => (
            <button
              key={page}
              className={
                currentPage === page
                  ? "inline-block font-medium duration-300 text-[1.0625rem] hover:opacity-80 px-[0.62rem] py-[0.18rem] rounded-[0.42rem]"
                  : "inline-block py-1 px-2 font-medium text-[1.0625rem]"
              }
              style={{
                background:
                  currentPage === page
                    ? "radial-gradient(circle, #39415C 0%, #555F83 100%)"
                    : "none",
              }}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          )
        )}
      </div>
      <button
        className="inline-flex hover:opacity-80 duration-300 gap-2 py-1 px-2 next-btn font-medium text-[1.0625rem] text-custom-gray"
        onClick={onPageNext}
        disabled={currentPage === totalPages}
      >
        Next
        <span>
          <NextIcon />
        </span>
      </button>
    </div>
  );
};
