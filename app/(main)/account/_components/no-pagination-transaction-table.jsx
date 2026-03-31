"use client";

import { useState, useEffect, useMemo } from "react";
import {
  ChevronDown, ChevronUp, MoreHorizontal, Trash,
  Search, X, RefreshCw, Clock,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
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
import { useRouter }       from "next/navigation";

const RECURRING_INTERVALS = {
  DAILY: "Daily", WEEKLY: "Weekly",
  MONTHLY: "Monthly", YEARLY: "Yearly",
};

export function NoPaginationTransactionTable({ transactions }) {
  const [selectedIds,     setSelectedIds]     = useState([]);
  const [sortConfig,      setSortConfig]      = useState({ field: "date", direction: "desc" });
  const [searchTerm,      setSearchTerm]      = useState("");
  const [typeFilter,      setTypeFilter]      = useState("");
  const [recurringFilter, setRecurringFilter] = useState("");
  const router = useRouter();

  const filteredAndSortedTransactions = useMemo(() => {
    let result = [...transactions];
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter((t) => t.description?.toLowerCase().includes(lower));
    }
    if (typeFilter) result = result.filter((t) => t.type === typeFilter);
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

  const handleSort = (field) =>
    setSortConfig((c) => ({ field, direction: c.field === field && c.direction === "asc" ? "desc" : "asc" }));

  const handleSelect    = (id) => setSelectedIds((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);
  const handleSelectAll = () =>
    setSelectedIds((p) => p.length === filteredAndSortedTransactions.length ? [] : filteredAndSortedTransactions.map((t) => t.id));

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
      // ✅ FIX: was toast.error (bug in original code)
      toast.success("Transactions deleted successfully");
      setSelectedIds([]);
    }
  }, [deleted, deleteLoading]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setTypeFilter("");
    setRecurringFilter("");
    setSelectedIds([]);
  };

  const SortIcon = ({ field }) => {
    if (sortConfig.field !== field) return null;
    return sortConfig.direction === "asc"
      ? <ChevronUp className="ml-1 h-3 w-3" />
      : <ChevronDown className="ml-1 h-3 w-3" />;
  };

  return (
    <div className="space-y-4">
      {deleteLoading && <BarLoader className="mt-4" width="100%" color="#9333ea" />}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[130px]"><SelectValue placeholder="All Types" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Types</SelectItem>
              <SelectItem value="INCOME">Income</SelectItem>
              <SelectItem value="EXPENSE">Expense</SelectItem>
            </SelectContent>
          </Select>

          <Select value={recurringFilter} onValueChange={setRecurringFilter}>
            <SelectTrigger className="w-[150px]"><SelectValue placeholder="All Transactions" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Transactions</SelectItem>
              <SelectItem value="recurring">Recurring Only</SelectItem>
              <SelectItem value="non-recurring">Non-recurring</SelectItem>
            </SelectContent>
          </Select>

          {selectedIds.length > 0 && (
            <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
              <Trash className="h-4 w-4 mr-2" />
              Delete ({selectedIds.length})
            </Button>
          )}

          {(searchTerm || typeFilter || recurringFilter) && (
            <Button variant="outline" size="icon" onClick={handleClearFilters} title="Clear filters">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={selectedIds.length === filteredAndSortedTransactions.length && filteredAndSortedTransactions.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("date")}>
                <div className="flex items-center">Date <SortIcon field="date" /></div>
              </TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("category")}>
                <div className="flex items-center">Category <SortIcon field="category" /></div>
              </TableHead>
              <TableHead className="cursor-pointer text-right" onClick={() => handleSort("amount")}>
                <div className="flex items-center justify-end">Amount <SortIcon field="amount" /></div>
              </TableHead>
              <TableHead>Recurring</TableHead>
              <TableHead className="w-[50px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  No transactions found
                </TableCell>
              </TableRow>
            ) : filteredAndSortedTransactions.map((t) => (
              <TableRow key={t.id}>
                <TableCell>
                  <Checkbox checked={selectedIds.includes(t.id)} onCheckedChange={() => handleSelect(t.id)} />
                </TableCell>
                <TableCell>{format(new Date(t.date), "PP")}</TableCell>
                <TableCell>{t.description}</TableCell>
                <TableCell className="capitalize">
                  <span
                    style={{ background: categoryColors[t.category] }}
                    className="px-2 py-1 rounded text-white text-sm"
                  >
                    {t.category}
                  </span>
                </TableCell>
                <TableCell className={cn("text-right font-medium", t.type === "EXPENSE" ? "text-red-500" : "text-green-500")}>
                  {t.type === "EXPENSE" ? "−" : "+"}${Number(t.amount).toFixed(2)}
                </TableCell>
                <TableCell>
                  {t.isRecurring ? (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Badge variant="secondary" className="gap-1 bg-purple-100 text-purple-700 hover:bg-purple-200">
                            <RefreshCw className="h-3 w-3" />
                            {RECURRING_INTERVALS[t.recurringInterval]}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="text-sm">
                            <div className="font-medium">Next Date:</div>
                            <div>{format(new Date(t.nextRecurringDate), "PPP")}</div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : (
                    <Badge variant="outline" className="gap-1">
                      <Clock className="h-3 w-3" />One-time
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => router.push(`/transaction/create?edit=${t.id}`)}>
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => deleteFn([t.id])}
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
    </div>
  );
}
