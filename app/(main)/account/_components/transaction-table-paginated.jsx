"use client";

import { useState, useCallback, useTransition, useEffect } from "react";
import {
  ChevronDown, ChevronUp, MoreHorizontal, Trash, Search,
  X, ChevronLeft, ChevronRight, RefreshCw, Clock,
  Download, SlidersHorizontal, Calendar,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/ui/table";
import { Input }    from "@/components/ui/input";
import { Button }   from "@/components/ui/button";
import { Badge }    from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn }              from "@/lib/utils";
import { categoryColors }  from "@/data/categories";
import { bulkDeleteTransactions, exportTransactionsCSV } from "@/actions/transaction-optimized";
import { TransactionTableSkeleton } from "@/components/ui/skeleton-loaders";

const RECURRING_INTERVALS = {
  DAILY: "Daily", WEEKLY: "Weekly",
  MONTHLY: "Monthly", YEARLY: "Yearly",
};

const CATEGORIES = [
  "housing","transportation","groceries","utilities","entertainment",
  "food","shopping","healthcare","education","personal","travel",
  "insurance","gifts","bills","other-expense",
  "salary","freelance","investments","business","rental","other-income",
];

export function TransactionTablePaginated({
  transactions,
  totalPages,
  total,
  currentPage,
  accountId,
}) {
  const router      = useRouter();
  const pathname    = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [selectedIds, setSelectedIds] = useState([]);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  // Sync filter state from URL
  const search          = searchParams.get("search") || "";
  const type            = searchParams.get("type")   || "";
  const category        = searchParams.get("category")|| "";
  const recurringFilter = searchParams.get("recurring")|| "";
  const dateFrom        = searchParams.get("dateFrom") || "";
  const dateTo          = searchParams.get("dateTo")   || "";
  const sortField       = searchParams.get("sort")     || "date";
  const sortDir         = searchParams.get("dir")      || "desc";

  const [localSearch, setLocalSearch] = useState(search);

  // Push URL param updates
  const updateParams = useCallback((updates) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([k, v]) => {
      if (v) params.set(k, v);
      else params.delete(k);
    });
    // Reset to page 1 on filter change
    if (!("page" in updates)) params.set("page", "1");
    startTransition(() => router.push(`${pathname}?${params.toString()}`));
  }, [searchParams, pathname, router]);

  // Debounced search
  useEffect(() => {
    const t = setTimeout(() => {
      if (localSearch !== search) updateParams({ search: localSearch });
    }, 400);
    return () => clearTimeout(t);
  }, [localSearch]);

  const handleSort = (field) => {
    updateParams({
      sort: field,
      dir: sortField === field && sortDir === "asc" ? "desc" : "asc",
    });
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return null;
    return sortDir === "asc"
      ? <ChevronUp className="ml-1 h-3 w-3" />
      : <ChevronDown className="ml-1 h-3 w-3" />;
  };

  // Selection
  const handleSelect    = (id) => setSelectedIds((prev) =>
    prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  const handleSelectAll = () => setSelectedIds((prev) =>
    prev.length === transactions.length ? [] : transactions.map((t) => t.id));

  // Bulk delete
  const handleBulkDelete = async () => {
    if (!window.confirm(`Delete ${selectedIds.length} transaction(s)?`)) return;
    setDeleteLoading(true);
    const res = await bulkDeleteTransactions(selectedIds);
    setDeleteLoading(false);
    if (res.success) {
      toast.success("Deleted successfully");
      setSelectedIds([]);
      router.refresh();
    } else {
      toast.error(res.error || "Delete failed");
    }
  };

  // CSV Export
  const handleExport = async () => {
    setExporting(true);
    try {
      const csv  = await exportTransactionsCSV(accountId);
      const blob = new Blob([csv], { type: "text/csv" });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
      a.download = `transactions-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("CSV exported");
    } catch {
      toast.error("Export failed");
    }
    setExporting(false);
  };

  const hasFilters = search || type || category || recurringFilter || dateFrom || dateTo;

  return (
    <div className="space-y-3">
      {/* ── Filter Bar ─────────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search transactions…"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="pl-9 h-9 rounded-xl"
            />
          </div>

          {/* Type */}
          <Select value={type} onValueChange={(v) => updateParams({ type: v === "ALL" ? "" : v })}>
            <SelectTrigger className="w-[130px] h-9 rounded-xl">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Types</SelectItem>
              <SelectItem value="INCOME">Income</SelectItem>
              <SelectItem value="EXPENSE">Expense</SelectItem>
            </SelectContent>
          </Select>

          {/* Category */}
          <Select value={category} onValueChange={(v) => updateParams({ category: v === "ALL" ? "" : v })}>
            <SelectTrigger className="w-[150px] h-9 rounded-xl">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Categories</SelectItem>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Recurring */}
          <Select value={recurringFilter} onValueChange={(v) => updateParams({ recurring: v === "ALL" ? "" : v })}>
            <SelectTrigger className="w-[150px] h-9 rounded-xl">
              <SelectValue placeholder="All Transactions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Transactions</SelectItem>
              <SelectItem value="recurring">Recurring Only</SelectItem>
              <SelectItem value="non-recurring">Non-recurring</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Date Range Row */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => updateParams({ dateFrom: e.target.value })}
              className="h-9 rounded-xl w-[150px]"
              placeholder="From"
            />
            <span className="text-muted-foreground text-sm">→</span>
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => updateParams({ dateTo: e.target.value })}
              className="h-9 rounded-xl w-[150px]"
              placeholder="To"
            />
          </div>

          <div className="flex gap-2 ml-auto">
            {/* Bulk delete */}
            {selectedIds.length > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBulkDelete}
                disabled={deleteLoading}
                className="h-9 rounded-xl"
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete ({selectedIds.length})
              </Button>
            )}

            {/* Export CSV */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              disabled={exporting}
              className="h-9 rounded-xl"
            >
              <Download className="h-4 w-4 mr-2" />
              {exporting ? "Exporting…" : "Export CSV"}
            </Button>

            {/* Clear filters */}
            {hasFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setLocalSearch("");
                  updateParams({
                    search: "", type: "", category: "",
                    recurring: "", dateFrom: "", dateTo: "", page: "1",
                  });
                }}
                className="h-9 rounded-xl"
              >
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Active filter chips */}
        {hasFilters && (
          <div className="flex flex-wrap gap-1.5">
            {search && (
              <Badge variant="secondary" className="gap-1 text-xs">
                Search: "{search}"
                <X className="h-3 w-3 cursor-pointer" onClick={() => { setLocalSearch(""); updateParams({ search: "" }); }} />
              </Badge>
            )}
            {type && (
              <Badge variant="secondary" className="gap-1 text-xs capitalize">
                {type.toLowerCase()}
                <X className="h-3 w-3 cursor-pointer" onClick={() => updateParams({ type: "" })} />
              </Badge>
            )}
            {category && (
              <Badge variant="secondary" className="gap-1 text-xs capitalize">
                {category}
                <X className="h-3 w-3 cursor-pointer" onClick={() => updateParams({ category: "" })} />
              </Badge>
            )}
            {recurringFilter && (
              <Badge variant="secondary" className="gap-1 text-xs">
                {recurringFilter}
                <X className="h-3 w-3 cursor-pointer" onClick={() => updateParams({ recurring: "" })} />
              </Badge>
            )}
            {(dateFrom || dateTo) && (
              <Badge variant="secondary" className="gap-1 text-xs">
                {dateFrom || "…"} → {dateTo || "…"}
                <X className="h-3 w-3 cursor-pointer" onClick={() => updateParams({ dateFrom: "", dateTo: "" })} />
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* ── Table ──────────────────────────────────────────────────────────── */}
      <div className={cn("rounded-2xl border border-border overflow-hidden transition-opacity", isPending && "opacity-60")}>
        {isPending && (
          <div className="h-1 w-full bg-primary/20 relative overflow-hidden">
            <div className="absolute inset-y-0 left-0 w-1/3 bg-primary animate-[slide_1s_ease-in-out_infinite]" />
          </div>
        )}
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="w-[48px]">
                <Checkbox
                  checked={selectedIds.length === transactions.length && transactions.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead className="cursor-pointer select-none" onClick={() => handleSort("date")}>
                <div className="flex items-center">Date <SortIcon field="date" /></div>
              </TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="cursor-pointer select-none" onClick={() => handleSort("category")}>
                <div className="flex items-center">Category <SortIcon field="category" /></div>
              </TableHead>
              <TableHead className="cursor-pointer select-none text-right" onClick={() => handleSort("amount")}>
                <div className="flex items-center justify-end">Amount <SortIcon field="amount" /></div>
              </TableHead>
              <TableHead>Recurring</TableHead>
              <TableHead className="w-[48px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                  <div className="flex flex-col items-center gap-2">
                    <SlidersHorizontal className="h-8 w-8 opacity-30" />
                    <p>No transactions found</p>
                    {hasFilters && (
                      <button
                        className="text-primary text-sm hover:underline"
                        onClick={() => updateParams({ search: "", type: "", category: "", recurring: "", dateFrom: "", dateTo: "" })}
                      >
                        Clear filters
                      </button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : transactions.map((t) => (
              <TableRow key={t.id} className="hover:bg-muted/30">
                <TableCell>
                  <Checkbox
                    checked={selectedIds.includes(t.id)}
                    onCheckedChange={() => handleSelect(t.id)}
                  />
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {format(new Date(t.date), "MMM d, yyyy")}
                </TableCell>
                <TableCell className="font-medium max-w-[200px] truncate">
                  {t.description || <span className="text-muted-foreground italic">No description</span>}
                </TableCell>
                <TableCell>
                  <span
                    className="px-2 py-1 rounded-md text-white text-xs font-medium capitalize"
                    style={{ backgroundColor: categoryColors[t.category] || "#64748b" }}
                  >
                    {t.category}
                  </span>
                </TableCell>
                <TableCell className={cn(
                  "text-right font-bold tabular-nums",
                  t.type === "EXPENSE" ? "text-red-500" : "text-emerald-500"
                )}>
                  {t.type === "EXPENSE" ? "−" : "+"}${Number(t.amount).toFixed(2)}
                </TableCell>
                <TableCell>
                  {t.isRecurring ? (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Badge variant="secondary" className="gap-1 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 text-xs">
                            <RefreshCw className="h-3 w-3" />
                            {RECURRING_INTERVALS[t.recurringInterval]}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          Next: {t.nextRecurringDate ? format(new Date(t.nextRecurringDate), "PPP") : "—"}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : (
                    <Badge variant="outline" className="gap-1 text-xs">
                      <Clock className="h-3 w-3" />One-time
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => router.push(`/transaction/create?edit=${t.id}`)}>
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={async () => {
                          setDeleteLoading(true);
                          await bulkDeleteTransactions([t.id]);
                          setDeleteLoading(false);
                          router.refresh();
                          toast.success("Deleted");
                        }}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* ── Pagination ─────────────────────────────────────────────────────── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-1">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * 10 + 1}–{Math.min(currentPage * 10, total)} of {total}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-lg"
              disabled={currentPage <= 1 || isPending}
              onClick={() => updateParams({ page: String(currentPage - 1) })}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {/* Page numbers */}
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              let page;
              if (totalPages <= 7) {
                page = i + 1;
              } else if (currentPage <= 4) {
                page = i + 1;
              } else if (currentPage >= totalPages - 3) {
                page = totalPages - 6 + i;
              } else {
                page = currentPage - 3 + i;
              }
              return (
                <Button
                  key={page}
                  variant={page === currentPage ? "default" : "outline"}
                  size="icon"
                  className="h-8 w-8 rounded-lg text-xs"
                  onClick={() => updateParams({ page: String(page) })}
                  disabled={isPending}
                >
                  {page}
                </Button>
              );
            })}

            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-lg"
              disabled={currentPage >= totalPages || isPending}
              onClick={() => updateParams({ page: String(currentPage + 1) })}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
