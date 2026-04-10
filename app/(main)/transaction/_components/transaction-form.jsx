"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Loader2, ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { format } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CreateAccountDrawer } from "@/components/create-account-drawer";
import { cn } from "@/lib/utils";
import { createTransaction, updateTransaction } from "@/actions/transaction";
import { transactionSchema } from "@/app/lib/schema";
import { ReceiptScanner } from "./recipt-scanner";

export function AddTransactionForm({
  accounts,
  categories,
  editMode = false,
  initialData = null,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues,
    reset,
  } = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues:
      editMode && initialData
        ? {
            type: initialData.type,
            amount: initialData.amount.toString(),
            description: initialData.description,
            accountId: initialData.accountId,
            category: initialData.category,
            date: new Date(initialData.date),
            isRecurring: initialData.isRecurring,
            ...(initialData.recurringInterval && {
              recurringInterval: initialData.recurringInterval,
            }),
          }
        : {
            type: "EXPENSE",
            amount: "",
            description: "",
            accountId: accounts.find((ac) => ac.isDefault)?.id,
            date: new Date(),
            isRecurring: false,
          },
  });

  const {
    loading: transactionLoading,
    fn: transactionFn,
    data: transactionResult,
  } = useFetch(editMode ? updateTransaction : createTransaction);

  const onSubmit = (data) => {
    const formData = {
      ...data,
      amount: parseFloat(data.amount),
    };
    if (editMode) {
      transactionFn(editId, formData);
    } else {
      transactionFn(formData);
    }
  };

  const handleScanComplete = (scannedData) => {
    if (!scannedData) return;
    setValue("amount", scannedData.amount.toString());
    setValue("date", new Date(scannedData.date));
    if (scannedData.description) setValue("description", scannedData.description);
    if (scannedData.category) {
      const matchedCategory = categories.find(
        (cat) => cat.name.toLowerCase() === scannedData.category.toLowerCase()
      );
      if (matchedCategory) setValue("category", matchedCategory.id);
    }
    toast.success("Receipt auto-filled ✨");
  };

  useEffect(() => {
    if (transactionResult?.success && !transactionLoading) {
      toast.success(
        editMode ? "Transaction updated successfully" : "Transaction created successfully"
      );
      reset();
      router.push(`/account/${transactionResult.data.accountId}`);
    }
  }, [transactionResult, transactionLoading, editMode]);

  const type = watch("type");
  const isRecurring = watch("isRecurring");
  const date = watch("date");

  const filteredCategories = categories.filter((category) => category.type === type);

  const isExpense = type === "EXPENSE";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

      {/* Receipt Scanner */}
      {!editMode && (
        <div className="mb-2">
          <ReceiptScanner onScanComplete={handleScanComplete} />
        </div>
      )}

      {/* Transaction Type Toggle */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Transaction Type
        </label>
        <div className="grid grid-cols-2 gap-3 p-1 rounded-xl bg-muted/50 border">
          {["EXPENSE", "INCOME"].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setValue("type", t)}
              className={cn(
                "flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200",
                type === t
                  ? t === "EXPENSE"
                    ? "bg-red-500 text-white shadow-sm"
                    : "bg-emerald-500 text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {t === "EXPENSE" ? (
                <ArrowDownCircle className="h-4 w-4" />
              ) : (
                <ArrowUpCircle className="h-4 w-4" />
              )}
              {t === "EXPENSE" ? "Expense" : "Income"}
            </button>
          ))}
        </div>
        {errors.type && (
          <p className="text-xs text-red-500">{errors.type.message}</p>
        )}
      </div>

      {/* Amount — featured input */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Amount
        </label>
        <div className="relative">
          <span className={cn(
            "absolute left-4 top-1/2 -translate-y-1/2 text-xl font-semibold pointer-events-none transition-colors",
            isExpense ? "text-red-500" : "text-emerald-500"
          )}>
            ₹
          </span>
          <Input
            type="number"
            step="0.01"
            placeholder="0.00"
            {...register("amount")}
            className={cn(
              "pl-9 h-14 text-2xl font-semibold tracking-tight border-2 transition-colors focus-visible:ring-0",
              isExpense
                ? "focus-visible:border-red-400"
                : "focus-visible:border-emerald-400"
            )}
          />
        </div>
        {errors.amount && (
          <p className="text-xs text-red-500">{errors.amount.message}</p>
        )}
      </div>

      {/* Account */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Account
        </label>
        <Select
          onValueChange={(value) => setValue("accountId", value)}
          defaultValue={getValues("accountId")}
        >
          <SelectTrigger className="h-11 border-border/60 bg-muted/30 hover:bg-muted/60 transition-colors">
            <SelectValue placeholder="Select account" />
          </SelectTrigger>
          <SelectContent>
            {accounts.map((account) => (
              <SelectItem key={account.id} value={account.id}>
                <div className="flex items-center justify-between gap-6">
                  <span>{account.name}</span>
                  <span className="text-xs text-muted-foreground font-mono">
                    ₹{parseFloat(account.balance).toFixed(2)}
                  </span>
                </div>
              </SelectItem>
            ))}
            <CreateAccountDrawer>
              <Button
                variant="ghost"
                className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
              >
                + Create Account
              </Button>
            </CreateAccountDrawer>
          </SelectContent>
        </Select>
        {errors.accountId && (
          <p className="text-xs text-red-500">{errors.accountId.message}</p>
        )}
      </div>

      {/* Category */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Category
        </label>
        <Select
          onValueChange={(value) => setValue("category", value)}
          defaultValue={getValues("category")}
        >
          <SelectTrigger className="h-11 border-border/60 bg-muted/30 hover:bg-muted/60 transition-colors">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {filteredCategories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && (
          <p className="text-xs text-red-500">{errors.category.message}</p>
        )}
      </div>

      {/* Date + Description — side by side on md+ */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Date */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Date
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full h-11 justify-start text-left font-normal border-border/60 bg-muted/30 hover:bg-muted/60",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(date) => setValue("date", date)}
                disabled={(date) =>
                  date > new Date() || date < new Date("1900-01-01")
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors.date && (
            <p className="text-xs text-red-500">{errors.date.message}</p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Description
          </label>
          <Input
            placeholder="What's this for?"
            {...register("description")}
            className="h-11 border-border/60 bg-muted/30 hover:bg-muted/60 focus-visible:bg-background transition-colors"
          />
          {errors.description && (
            <p className="text-xs text-red-500">{errors.description.message}</p>
          )}
        </div>
      </div>

      {/* Recurring Toggle */}
      <div className={cn(
        "flex flex-row items-center justify-between rounded-xl border-2 p-4 transition-colors",
        isRecurring ? "border-violet-200 bg-violet-50/50 dark:border-violet-800 dark:bg-violet-950/20" : "border-border/60 bg-muted/20"
      )}>
        <div className="space-y-0.5">
          <label className="text-sm font-semibold">Recurring Transaction</label>
          <p className="text-xs text-muted-foreground">
            Auto-repeat this transaction on a schedule
          </p>
        </div>
        <Switch
          checked={isRecurring}
          onCheckedChange={(checked) => setValue("isRecurring", checked)}
          className="data-[state=checked]:bg-violet-500"
        />
      </div>

      {/* Recurring Interval */}
      {isRecurring && (
        <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
          <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Repeat Every
          </label>
          <div className="grid grid-cols-4 gap-2">
            {["DAILY", "WEEKLY", "MONTHLY", "YEARLY"].map((interval) => (
              <button
                key={interval}
                type="button"
                onClick={() => setValue("recurringInterval", interval)}
                className={cn(
                  "py-2 rounded-lg text-sm font-medium border transition-all",
                  getValues("recurringInterval") === interval
                    ? "bg-violet-500 text-white border-violet-500"
                    : "border-border/60 text-muted-foreground hover:border-violet-300 hover:text-violet-600"
                )}
              >
                {interval.charAt(0) + interval.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
          {errors.recurringInterval && (
            <p className="text-xs text-red-500">{errors.recurringInterval.message}</p>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-2 pb-6">
        <Button
          type="button"
          variant="outline"
          className="w-full h-11 border-border/60"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={transactionLoading}
          className={cn(
            "w-full h-11 font-semibold transition-all",
            isExpense
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-emerald-500 hover:bg-emerald-600 text-white"
          )}
        >
          {transactionLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {editMode ? "Updating..." : "Saving..."}
            </>
          ) : editMode ? (
            "Update Transaction"
          ) : (
            `Add ${isExpense ? "Expense" : "Income"}`
          )}
        </Button>
      </div>
    </form>
  );
}
