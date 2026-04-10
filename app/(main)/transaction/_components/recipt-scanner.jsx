"use client";

import { useRef, useEffect } from "react";
import { Camera, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import useFetch from "@/hooks/use-fetch";
import { scanReceipt } from "@/actions/transaction";

export function ReceiptScanner({ onScanComplete }) {
  const fileInputRef = useRef(null);

  const {
    loading: scanReceiptLoading,
    fn: scanReceiptFn,
    data: scannedData,
    error,
  } = useFetch(scanReceipt);

  const handleReceiptScan = async (file) => {
    // ✅ FIX 1: Validation is also in the server action, but keep client-side
    // checks for fast feedback — no need for try/catch here since useFetch handles it
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be under 5MB");
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast.error("Only image files allowed");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    await scanReceiptFn(formData);
  };

  useEffect(() => {
    if (scannedData && !scanReceiptLoading) {
      onScanComplete(scannedData);
      // ✅ FIX 2: Removed duplicate toast — the form's handleScanComplete
      // already calls toast.success("Receipt auto-filled ✨")
    }
  }, [scannedData, scanReceiptLoading]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Receipt scan failed");
    }
  }, [error]);

  return (
    <div className="w-full">
      {/* ✅ FIX 3: Removed capture="environment" — it breaks the file picker
          on desktop browsers (Chrome/Firefox ignore or misbehave with it).
          accept="image/*" alone works correctly on both mobile and desktop. */}
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
        disabled={scanReceiptLoading}
        className="group relative w-full overflow-hidden rounded-xl border-2 border-dashed border-violet-200 bg-violet-50/40 px-4 py-4 text-sm font-medium transition-all hover:border-violet-400 hover:bg-violet-50 active:scale-[0.99] disabled:opacity-60 dark:border-violet-800 dark:bg-violet-950/20 dark:hover:bg-violet-950/40"
      >
        <div className="flex items-center justify-center gap-2.5">
          {scanReceiptLoading ? (
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
        {!scanReceiptLoading && (
          <p className="mt-1 text-center text-xs text-muted-foreground">
            Upload a photo of your receipt — we&apos;ll fill in the details
          </p>
        )}
      </button>
    </div>
  );
}
