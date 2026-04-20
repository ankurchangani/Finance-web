"use client";
// app/dashboard/_components/budget-progress.jsx

import { useState, useEffect } from "react";
import { Pencil, Check, X, Target } from "lucide-react";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { updateBudget } from "@/actions/budget";
import { cn } from "@/lib/utils";

function getColor(pct) {
  if (pct >= 90) return { bar: "from-red-500 to-red-600", text: "text-red-400", bg: "bg-red-500/10" };
  if (pct >= 75) return { bar: "from-amber-400 to-orange-500", text: "text-amber-400", bg: "bg-amber-500/10" };
  return { bar: "from-emerald-400 to-teal-500", text: "text-emerald-400", bg: "bg-emerald-500/10" };
}

export function BudgetProgress({ initialBudget, currentExpenses }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newBudget, setNewBudget] = useState(initialBudget?.amount?.toString() || "");

  const {
    loading: isLoading,
    fn: updateBudgetFn,
    data: updatedBudget,
    error,
  } = useFetch(updateBudget);

  const percentUsed = initialBudget
    ? Math.min((currentExpenses / initialBudget.amount) * 100, 100)
    : 0;

  const colors = getColor(percentUsed);

  const handleUpdateBudget = async () => {
    const amount = parseFloat(newBudget);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    await updateBudgetFn(amount);
  };

  const handleCancel = () => {
    setNewBudget(initialBudget?.amount?.toString() || "");
    setIsEditing(false);
  };

  useEffect(() => {
    if (updatedBudget?.success) {
      setIsEditing(false);
      toast.success("Budget updated successfully");
    }
  }, [updatedBudget]);

  useEffect(() => {
    if (error) toast.error(error.message || "Failed to update budget");
  }, [error]);

  return (
    <div className="rounded-2xl bg-slate-800/70 border border-slate-700/50 p-5 hover:border-slate-600 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center", colors.bg)}>
            <Target className={cn("w-4.5 h-4.5", colors.text)} />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
              Monthly Budget
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              Default Account
            </p>
          </div>
        </div>

        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="h-8 w-8 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-700/60 transition-all duration-150"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="flex items-center gap-2">
          <Input
            type="number"
            value={newBudget}
            onChange={(e) => setNewBudget(e.target.value)}
            className="w-36 h-9 text-sm bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
            placeholder="Enter amount"
            autoFocus
            disabled={isLoading}
          />
          <button
            onClick={handleUpdateBudget}
            disabled={isLoading}
            className="h-9 w-9 flex items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 transition-colors"
          >
            <Check className="h-4 w-4" />
          </button>
          <button
            onClick={handleCancel}
            disabled={isLoading}
            className="h-9 w-9 flex items-center justify-center rounded-xl bg-red-500/15 text-red-400 hover:bg-red-500/25 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="flex items-baseline gap-2 mb-4">
          {initialBudget ? (
            <>
              <span className="text-2xl font-black text-white tabular-nums">
                ${currentExpenses.toFixed(2)}
              </span>
              <span className="text-sm text-slate-400">
                of ${initialBudget.amount.toFixed(2)} spent
              </span>
            </>
          ) : (
            <span className="text-sm text-slate-400">No budget set</span>
          )}
        </div>
      )}

      {initialBudget && !isEditing && (
        <div className="space-y-2">
          <div className="h-2.5 rounded-full bg-slate-700/60 overflow-hidden">
            <div
              className={cn("h-full rounded-full bg-gradient-to-r transition-all duration-700 ease-out", colors.bar)}
              style={{ width: `${percentUsed}%` }}
            />
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">
              ${(initialBudget.amount - currentExpenses).toFixed(2)} remaining
            </span>
            <span className={cn("font-bold", colors.text)}>
              {percentUsed.toFixed(1)}% used
            </span>
          </div>
        </div>
      )}
    </div>
  );
}