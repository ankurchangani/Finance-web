"use client";

import { useRef, useEffect } from "react";
import { Camera, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    try {
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
    } catch (err) {
      console.error(err);
      toast.error("Scan failed");
    }
  };

  useEffect(() => {
    if (scannedData && !scanReceiptLoading) {
      onScanComplete(scannedData);
      toast.success("Receipt scanned 🎉");
    }
  }, [scannedData, scanReceiptLoading]);

  useEffect(() => {
    if (error) {
      toast.error("AI Scan failed");
    }
  }, [error]);

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleReceiptScan(file);
          e.target.value = "";
        }}
      />

      <Button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={scanReceiptLoading}
        className="w-full h-11 text-white bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500"
      >
        {scanReceiptLoading ? (
          <>
            <Loader2 className="mr-2 animate-spin" size={18} />
            Scanning Receipt...
          </>
        ) : (
          <>
            <Camera className="mr-2" size={18} />
            Scan Receipt with AI
          </>
        )}
      </Button>
    </div>
  );
}
