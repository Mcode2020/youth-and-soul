import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalCount?: number;
}

export function ProductPagination({ page, totalPages, onPageChange, totalCount }: ProductPaginationProps) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 4) pages.push("...");
      const start = Math.max(2, page - 2);
      const end = Math.min(totalPages - 1, page + 2);
      for (let i = start; i <= end; i++) pages.push(i);
      if (page < totalPages - 3) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="flex flex-col items-center gap-3 mt-8 px-4">
      <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap max-w-full overflow-x-auto">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className={cn(
            "flex items-center gap-1 px-2.5 py-2 sm:px-4 sm:py-2.5 rounded-xl border text-sm font-medium transition-all flex-shrink-0",
            page === 1
              ? "border-border/30 text-muted-foreground/40 cursor-not-allowed"
              : "border-border bg-card text-foreground hover:bg-secondary shadow-sm"
          )}
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Previous</span>
        </button>

        {/* Page Numbers */}
        {getPageNumbers().map((p, i) =>
          p === "..." ? (
            <span key={`dots-${i}`} className="px-1 sm:px-2 text-sm text-muted-foreground flex-shrink-0">…</span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p as number)}
              className={cn(
                "min-w-[36px] h-[36px] sm:min-w-[42px] sm:h-[42px] rounded-xl text-xs sm:text-sm font-semibold transition-all flex-shrink-0",
                page === p
                  ? "bg-foreground text-background shadow-lg"
                  : "border border-border bg-card text-foreground hover:bg-secondary shadow-sm"
              )}
            >
              {p}
            </button>
          )
        )}

        {/* Next Button */}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className={cn(
            "flex items-center gap-1 px-2.5 py-2 sm:px-4 sm:py-2.5 rounded-xl border text-sm font-medium transition-all flex-shrink-0",
            page === totalPages
              ? "border-border/30 text-muted-foreground/40 cursor-not-allowed"
              : "border-border bg-card text-foreground hover:bg-secondary shadow-sm"
          )}
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {totalCount !== undefined && (
        <span className="text-xs text-muted-foreground">
          Page {page} of {totalPages} · {totalCount} products
        </span>
      )}
    </div>
  );
}
