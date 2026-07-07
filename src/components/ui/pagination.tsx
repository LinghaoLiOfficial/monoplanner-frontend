import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

type PaginationProps = {
  page: number;
  totalPages: number;
};

export function Pagination({ page, totalPages }: PaginationProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-border/60 bg-background/70 px-4 py-3">
      <div className="text-sm text-muted-foreground">
        Page {page} of {totalPages}
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" disabled={page <= 1}>
          <ChevronLeft className="size-4" />
          上一页
        </Button>
        <Button variant="outline" size="sm" disabled={page >= totalPages}>
          下一页
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
