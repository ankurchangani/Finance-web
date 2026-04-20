"use client";

import {
  ArrowUpRight, ArrowDownRight,
  MoreVertical, Trash2, Star,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useFetch from "@/hooks/use-fetch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { updateDefaultAccount, deleteAccount } from "@/actions/account";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const TYPE_STYLES = {
  CURRENT: {
    gradient: "from-violet-500/10 via-blue-500/5 to-transparent",
    accent: "#8B5CF6",
    accentLight: "bg-violet-500/15",
    accentText: "text-violet-300",
    accentBorder: "border-violet-500/25",
    label: "Current",
  },
  SAVINGS: {
    gradient: "from-emerald-500/10 via-teal-500/5 to-transparent",
    accent: "#10B981",
    accentLight: "bg-emerald-500/15",
    accentText: "text-emerald-300",
    accentBorder: "border-emerald-500/25",
    label: "Savings",
  },
};

export function AccountCard({ account, delay = 0 }) {
  const { name, type, balance, id, isDefault } = account;
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const style = TYPE_STYLES[type] || TYPE_STYLES.CURRENT;

  const {
    loading: updateDefaultLoading,
    fn: updateDefaultFn,
    data: updatedAccount,
    error: updateError,
  } = useFetch(updateDefaultAccount);

  const {
    loading: deleteLoading,
    fn: deleteFn,
    data: deleteResult,
    error: deleteError,
  } = useFetch(deleteAccount);

  const handleCardClick = () => router.push(`/account/${id}`);

  const handleDefaultChange = (e) => {
    e.stopPropagation();
    if (isDefault) {
      toast.warning("At least 1 default account is required");
      return;
    }
    updateDefaultFn(id);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    setDropdownOpen(false);
    if (!window.confirm(`Delete "${name}" account?\nThis will also delete all its transactions.`)) return;
    deleteFn(id);
  };

  useEffect(() => {
    if (updatedAccount?.success) toast.success("Default account updated");
  }, [updatedAccount]);

  useEffect(() => {
    if (updateError) toast.error(updateError.message || "Failed to update default account");
  }, [updateError]);

  useEffect(() => {
    if (deleteResult?.success) toast.success(`"${name}" account deleted`);
  }, [deleteResult]);

  useEffect(() => {
    if (deleteError) toast.error(deleteError.message || "Failed to delete account");
  }, [deleteError]);

  return (
    <div
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleCardClick()}
      className={cn(
        "group relative rounded-2xl overflow-hidden cursor-pointer select-none",
        "bg-slate-800/70",
        "border border-slate-700/50",
        "hover:border-slate-500",
        "hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-slate-900/40",
        "active:translate-y-0 active:shadow-md",
        "transition-all duration-300 ease-out",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/40"
      )}
      style={{
        animation: "float-up 0.45s ease both",
        animationDelay: `${delay}ms`,
      }}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2.5px]"
        style={{
          background: `linear-gradient(90deg, ${style.accent}, ${style.accent}44, transparent)`,
          opacity: isDefault ? 1 : 0,
          transition: "opacity 0.3s",
        }}
      />
      <div
        className="absolute top-0 left-0 right-0 h-[2.5px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(90deg, ${style.accent}77, ${style.accent}22, transparent)` }}
      />

      {/* Hover bg gradient */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none",
          style.gradient
        )}
      />

      {/* Glow blob */}
      <div
        className="absolute -top-6 -right-6 w-20 h-20 rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"
        style={{ background: style.accent }}
      />

      <div className="relative p-5">

        {/* Header row */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex-1 min-w-0 pr-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-white text-base truncate capitalize">
                {name}
              </span>
              {isDefault && (
                <span
                  className={cn(
                    "inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border",
                    style.accentLight,
                    style.accentText,
                    style.accentBorder
                  )}
                >
                  <Star className="w-2.5 h-2.5 fill-current" />
                  Default
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{style.label} Account</p>
          </div>

          {/* Controls */}
          <div
            className="flex items-center gap-1 flex-shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <Switch
              checked={isDefault}
              onClick={handleDefaultChange}
              disabled={updateDefaultLoading}
              className="scale-90 data-[state=checked]:bg-violet-500"
            />

            <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <button
                  onClick={(e) => { e.stopPropagation(); setDropdownOpen((p) => !p); }}
                  className="h-8 w-8 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-700/60 transition-all duration-150 focus:outline-none"
                >
                  <MoreVertical className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-44 shadow-2xl rounded-xl p-1 border border-slate-700 bg-slate-800"
                onClick={(e) => e.stopPropagation()}
              >
                <DropdownMenuSeparator className="my-1 bg-slate-700/50" />
                <DropdownMenuItem
                  onClick={handleDelete}
                  disabled={deleteLoading}
                  className="flex items-center gap-2 cursor-pointer rounded-lg px-3 py-2 text-sm text-red-400 focus:text-red-400 hover:bg-red-500/10"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  {deleteLoading ? "Deleting…" : "Delete Account"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Balance */}
        <div className="mb-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500 mb-1">
            Balance
          </p>
          <p className="text-[1.8rem] font-black text-white tabular-nums tracking-tight leading-none transition-transform duration-300 group-hover:scale-[1.02] origin-left">
            ${parseFloat(balance).toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 pt-3 border-t border-slate-700/40">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <div className="w-5 h-5 rounded-md bg-emerald-500/15 flex items-center justify-center">
              <ArrowUpRight className="w-3 h-3 text-emerald-500" />
            </div>
            Income
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <div className="w-5 h-5 rounded-md bg-red-500/15 flex items-center justify-center">
              <ArrowDownRight className="w-3 h-3 text-red-500" />
            </div>
            Expense
          </div>

          <div className="ml-auto opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-1 group-hover:translate-x-0">
            <ArrowUpRight
              className="w-4 h-4"
              style={{ color: style.accent }}
            />
          </div>
        </div>

      </div>
    </div>
  );
}