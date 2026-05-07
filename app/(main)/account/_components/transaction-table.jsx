"use client";

import { useState, useEffect, useMemo } from "react";
import {
  ChevronDown, ChevronUp, MoreHorizontal, Trash,
  Search, X, ChevronLeft, ChevronRight, RefreshCw, Clock,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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
import { cn }             from "@/lib/utils";
import { categoryColors } from "@/data/categories";
import { bulkDeleteTransactions } from "@/actions/account";
import useFetch            from "@/hooks/use-fetch";
import { BarLoader }       from "react-spinners";

// ─── Constants ────────────────────────────────────────────────
const ITEMS_PER_PAGE = 10;

const RECURRING_INTERVALS = {
  DAILY:   "Daily",
  WEEKLY:  "Weekly",
  MONTHLY: "Monthly",
  YEARLY:  "Yearly",
};

// ─── Sort Icon Helper ─────────────────────────────────────────
function SortIcon({ field, sortConfig }) {
  if (sortConfig.field !== field) return null;
  return sortConfig.direction === "asc"
    ? <ChevronUp   className="ml-1 h-3 w-3" />
    : <ChevronDown className="ml-1 h-3 w-3" />;
}

// ─── Main Component ───────────────────────────────────────────
export function TransactionTable({ transactions }) {
  const router = useRouter();

  const [selectedIds,     setSelectedIds]     = useState([]);
  const [sortConfig,      setSortConfig]      = useState({ field: "date", direction: "desc" });
  const [searchTerm,      setSearchTerm]      = useState("");
  const [typeFilter,      setTypeFilter]      = useState("");
  const [recurringFilter, setRecurringFilter] = useState("");
  const [currentPage,     setCurrentPage]     = useState(1);

  // ── Filtering & Sorting ──────────────────────────────────────
  const filteredAndSorted = useMemo(() => {
    let result = [...transactions];

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter((t) =>
        t.description?.toLowerCase().includes(lower)
      );
    }

    if (typeFilter) {
      result = result.filter((t) => t.type === typeFilter);
    }

    if (recurringFilter === "recurring")     result = result.filter((t) =>  t.isRecurring);
    if (recurringFilter === "non-recurring") result = result.filter((t) => !t.isRecurring);

    result.sort((a, b) => {
      let cmp = 0;
      if (sortConfig.field === "date")     cmp = new Date(a.date) - new Date(b.date);
      if (sortConfig.field === "amount")   cmp = a.amount - b.amount;
      if (sortConfig.field === "category") cmp = a.category.localeCompare(b.category);
      return sortConfig.direction === "asc" ? cmp : -cmp;
    });

    return result;
  }, [transactions, searchTerm, typeFilter, recurringFilter, sortConfig]);

  // ── Pagination ───────────────────────────────────────────────
  const totalPages = Math.ceil(filteredAndSorted.length / ITEMS_PER_PAGE);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSorted.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAndSorted, currentPage]);

  // ── Handlers ─────────────────────────────────────────────────
  const handleSort = (field) =>
    setSortConfig((c) => ({
      field,
      direction: c.field === field && c.direction === "asc" ? "desc" : "asc",
    }));

  const handleSelect = (id) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const handleSelectAll = () =>
    setSelectedIds((prev) =>
      prev.length === paginated.length ? [] : paginated.map((t) => t.id)
    );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSelectedIds([]);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setTypeFilter("");
    setRecurringFilter("");
    setCurrentPage(1);
    setSelectedIds([]);
  };

  // ── Delete ───────────────────────────────────────────────────
  const {
    loading: deleteLoading,
    fn: deleteFn,
    data: deleted,
  } = useFetch(bulkDeleteTransactions);

  const handleBulkDelete = async () => {
    if (!window.confirm(`Delete ${selectedIds.length} transaction(s)?`)) return;
    deleteFn(selectedIds);
  };

  useEffect(() => {
    if (deleted && !deleteLoading) {
      toast.success("Transactions deleted successfully");
      setSelectedIds([]);
    }
  }, [deleted, deleteLoading]);

  const hasFilters = searchTerm || typeFilter || recurringFilter;

  // ── Render ───────────────────────────────────────────────────
  return (
    <div className="space-y-4 py-8">

      {deleteLoading && (
        <BarLoader className="mt-4" width="100%" color="#9333ea" />
      )}

      {/* ── Filter Bar ──────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-4">

        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-8"
          />
        </div>

        <div className="flex gap-2 flex-wrap">

          {/* Type Filter */}
          <Select
            value={typeFilter}
            onValueChange={(v) => { setTypeFilter(v === "ALL" ? "" : v); setCurrentPage(1); }}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Types</SelectItem>
              <SelectItem value="INCOME">Income</SelectItem>
              <SelectItem value="EXPENSE">Expense</SelectItem>
            </SelectContent>
          </Select>

          {/* Recurring Filter */}
          <Select
            value={recurringFilter}
            onValueChange={(v) => { setRecurringFilter(v === "ALL" ? "" : v); setCurrentPage(1); }}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Transactions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Transactions</SelectItem>
              <SelectItem value="recurring">Recurring Only</SelectItem>
              <SelectItem value="non-recurring">Non-recurring</SelectItem>
            </SelectContent>
          </Select>

          {/* Bulk Delete */}
          {selectedIds.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleBulkDelete}
              disabled={deleteLoading}
            >
              <Trash className="h-4 w-4 mr-2" />
              Delete ({selectedIds.length})
            </Button>
          )}

          {/* Clear Filters */}
          {hasFilters && (
            <Button
              variant="outline"
              size="icon"
              onClick={handleClearFilters}
              title="Clear filters"
            >
              <X className="h-4 w-4" />
            </Button>
          )}

        </div>
      </div>

      {/* ── Table ───────────────────────────────────────────── */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={
                    paginated.length > 0 &&
                    selectedIds.length === paginated.length
                  }
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead
                className="cursor-pointer select-none"
                onClick={() => handleSort("date")}
              >
                <div className="flex items-center">
                  Date <SortIcon field="date" sortConfig={sortConfig} />
                </div>
              </TableHead>
              <TableHead>Description</TableHead>
              <TableHead
                className="cursor-pointer select-none"
                onClick={() => handleSort("category")}
              >
                <div className="flex items-center">
                  Category <SortIcon field="category" sortConfig={sortConfig} />
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer select-none text-right"
                onClick={() => handleSort("amount")}
              >
                <div className="flex items-center justify-end">
                  Amount <SortIcon field="amount" sortConfig={sortConfig} />
                </div>
              </TableHead>
              <TableHead>Recurring</TableHead>
              <TableHead className="w-[50px]" />
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-muted-foreground"
                >
                  No transactions found
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((t) => (
                <TableRow key={t.id}>

                  {/* Checkbox */}
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(t.id)}
                      onCheckedChange={() => handleSelect(t.id)}
                    />
                  </TableCell>

                  {/* Date */}
                  <TableCell className="text-sm text-muted-foreground">
                    {format(new Date(t.date), "PP")}
                  </TableCell>

                  {/* Description */}
                  <TableCell className="max-w-[180px] truncate">
                    {t.description || (
                      <span className="text-muted-foreground italic">
                        No description
                      </span>
                    )}
                  </TableCell>

                  {/* Category */}
                  <TableCell className="capitalize">
                    <span
                      style={{
                        background: categoryColors[t.category] || "#64748b",
                      }}
                      className="px-2 py-1 rounded text-white text-xs font-medium"
                    >
                      {t.category}
                    </span>
                  </TableCell>

                  {/* Amount */}
                  <TableCell
                    className={cn(
                      "text-right font-bold tabular-nums",
                      t.type === "EXPENSE" ? "text-red-500" : "text-green-500"
                    )}
                  >
                    {t.type === "EXPENSE" ? "−" : "+"}$
                    {Number(t.amount).toFixed(2)}
                  </TableCell>

                  {/* Recurring Badge */}
                  <TableCell>
                    {t.isRecurring ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Badge
                              variant="secondary"
                              className="gap-1 bg-purple-100 text-purple-700 hover:bg-purple-200"
                            >
                              <RefreshCw className="h-3 w-3" />
                              {RECURRING_INTERVALS[t.recurringInterval]}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="text-sm">
                              <div className="font-medium">Next Date:</div>
                              <div>
                                {t.nextRecurringDate
                                  ? format(new Date(t.nextRecurringDate), "PPP")
                                  : "—"}
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <Badge variant="outline" className="gap-1">
                        <Clock className="h-3 w-3" />
                        One-time
                      </Badge>
                    )}
                  </TableCell>

                  {/* Actions */}
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(`/transaction/create?edit=${t.id}`)
                          }
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => deleteFn([t.id])}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>

                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* ── Pagination ──────────────────────────────────────── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}