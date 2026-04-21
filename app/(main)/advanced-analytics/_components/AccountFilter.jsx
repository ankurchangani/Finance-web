"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { C, PALETTE, fmtK } from "./utils";

export function AccountFilter({ accounts, value, onChange }) {
  const [open, setOpen] = useState(false);

  const selectedLabel =
    value === "ALL"
      ? "All Accounts"
      : (accounts.find((a) => a.id === value)?.name ?? "All Accounts");

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-poppins text-white/70 hover:text-white hover:border-white/20 transition-all duration-200"
        style={{ background: C.card, borderColor: C.border, minWidth: 148 }}
      >
        {value !== "ALL" && (
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: PALETTE[accounts.findIndex((a) => a.id === value) % PALETTE.length] }}
          />
        )}
        <span className="flex-1 text-left truncate">{selectedLabel}</span>
        <ChevronDown
          className={cn(
            "w-3.5 h-3.5 text-white/40 flex-shrink-0 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            className="absolute right-0 top-full mt-1.5 z-50 min-w-[190px] rounded-2xl border overflow-hidden shadow-2xl"
            style={{ background: "hsl(220,22%,10%)", borderColor: "rgba(255,255,255,0.12)" }}
          >
            {/* All Accounts */}
            <button
              onClick={() => { onChange("ALL"); setOpen(false); }}
              className={cn(
                "w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-poppins transition-colors duration-150 text-left",
                value === "ALL" ? "text-white" : "text-white/50 hover:text-white hover:bg-white/[0.04]"
              )}
              style={value === "ALL" ? { background: `${C.blue}15`, color: C.blue } : {}}
            >
              <span
                className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
                style={{ background: value === "ALL" ? `${C.blue}25` : "rgba(255,255,255,0.06)" }}
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <rect x="0" y="0" width="4" height="4" rx="1" fill="currentColor" opacity="0.7" />
                  <rect x="6" y="0" width="4" height="4" rx="1" fill="currentColor" opacity="0.7" />
                  <rect x="0" y="6" width="4" height="4" rx="1" fill="currentColor" opacity="0.7" />
                  <rect x="6" y="6" width="4" height="4" rx="1" fill="currentColor" opacity="0.7" />
                </svg>
              </span>
              <span className="font-medium flex-1">All Accounts</span>
              {value === "ALL" && (
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: C.blue }} />
              )}
            </button>

            <div className="mx-3 my-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />

            {/* Per-account options */}
            {accounts.map((a, i) => {
              const color      = PALETTE[i % PALETTE.length];
              const isSelected = value === a.id;
              return (
                <button
                  key={a.id}
                  onClick={() => { onChange(a.id); setOpen(false); }}
                  className={cn(
                    "w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-poppins transition-all duration-150 text-left",
                    isSelected ? "text-white" : "text-white/50 hover:text-white hover:bg-white/[0.04]"
                  )}
                  style={isSelected ? { background: `${color}12` } : {}}
                >
                  <span
                    className="w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-extrabold font-montserrat flex-shrink-0"
                    style={{ background: `${color}25`, color }}
                  >
                    {a.name.charAt(0).toUpperCase()}
                  </span>
                  <span className="flex-1 truncate font-medium">{a.name}</span>
                  <span
                    className="text-[9px] font-montserrat font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
                    style={{ background: `${color}15`, color: `${color}cc` }}
                  >
                    {fmtK(a.balance)}
                  </span>
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full ml-1" style={{ background: color }} />
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}