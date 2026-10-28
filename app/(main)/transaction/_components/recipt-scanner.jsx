"use client";

import { useRef, useState } from "react";
import { Camera, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { scanReceipt } from "@/actions/transaction";

export function ReceiptScanner({ onScanComplete }) {
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const handleReceiptScan = async (file) => {
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be under 5MB");
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const data = await scanReceipt(formData);

      if (data && Object.keys(data).length > 0) {
        if (typeof onScanComplete === "function") {
          onScanComplete(data);
        }
      } else {
        toast.info("No transaction details detected from this image");
      }
    } catch (err) {
      toast.error(err.message || "Receipt scan failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleReceiptScan(file);
          e.target.value = "";
        }}
      />

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={loading}
        className="group relative w-full overflow-hidden rounded-xl border-2 border-dashed border-violet-200 bg-violet-50/40 px-4 py-4 text-sm font-medium transition-all hover:border-violet-400 hover:bg-violet-50 active:scale-[0.99] disabled:opacity-60 dark:border-violet-800 dark:bg-violet-950/20 dark:hover:bg-violet-950/40"
      >
        <div className="flex items-center justify-center gap-2.5">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-violet-500" />
              <span className="text-violet-600 dark:text-violet-400">
                Scanning receipt...
              </span>
            </>
          ) : (
            <>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-900/60">
                <Camera className="h-4 w-4 text-violet-600 dark:text-violet-400" />
              </div>
              <div className="text-left">
                <span className="text-violet-700 dark:text-violet-300 font-semibold">
                  Scan Receipt with AI
                </span>
                <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-600 dark:bg-violet-900/60 dark:text-violet-400">
                  <Sparkles className="h-3 w-3" />
                  Auto-fill
                </span>
              </div>
            </>
          )}
        </div>
      </button>
    </div>
  );
}
