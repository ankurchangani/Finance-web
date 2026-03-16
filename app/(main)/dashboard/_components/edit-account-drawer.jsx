
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { editAccount } from "@/actions/account";
import { accountSchema } from "@/app/lib/schema";

// ✅ Added onSuccess prop — parent can react when edit completes
export function EditAccountDrawer({ account, open, onOpenChange, onSuccess }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: account?.name || "",
      type: account?.type || "CURRENT",
      balance: account?.balance?.toString() || "",
      isDefault: account?.isDefault || false,
    },
  });

  // Reset form when account changes
  useEffect(() => {
    if (account) {
      reset({
        name: account.name,
        type: account.type,
        balance: account.balance?.toString(),
        isDefault: account.isDefault,
      });
    }
  }, [account, reset]);

  const {
    loading: editLoading,
    fn: editAccountFn,
    data: editResult,
    error,
  } = useFetch(editAccount);

  const onSubmit = async (data) => {
    await editAccountFn(account.id, data);
  };

  useEffect(() => {
    if (editResult?.success) {
      toast.success("Account updated successfully");
      // ✅ Notify parent that edit succeeded (so it can hide the edit icon)
      onSuccess?.();
      onOpenChange(false);
    }
  }, [editResult]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to update account");
    }
  }, [error]);

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="bg-white dark:bg-[hsl(220,20%,8%)] border-t border-[hsl(214,32%,91%)] dark:border-[hsl(220,15%,15%)]">
        <DrawerHeader>
          <DrawerTitle className="text-[hsl(222,47%,11%)] dark:text-[hsl(210,40%,98%)] text-lg font-semibold">
            Edit Account
          </DrawerTitle>
        </DrawerHeader>

        <div className="px-4 pb-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* Account Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[hsl(222,47%,11%)] dark:text-[hsl(210,40%,98%)]">
                Account Name
              </label>
              <Input
                placeholder="e.g., Main Checking"
                className="bg-white dark:bg-[hsl(220,20%,6%)] border-[hsl(214,32%,91%)] dark:border-[hsl(220,15%,15%)] focus-visible:ring-[hsl(217,91%,60%)]"
                {...register("name")}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>

            {/* Account Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[hsl(222,47%,11%)] dark:text-[hsl(210,40%,98%)]">
                Account Type
              </label>
              <Select
                onValueChange={(value) => setValue("type", value)}
                defaultValue={watch("type")}
              >
                <SelectTrigger className="bg-white dark:bg-[hsl(220,20%,6%)] border-[hsl(214,32%,91%)] dark:border-[hsl(220,15%,15%)]">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CURRENT">Current</SelectItem>
                  <SelectItem value="SAVINGS">Savings</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && <p className="text-sm text-red-500">{errors.type.message}</p>}
            </div>

            {/* Balance */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[hsl(222,47%,11%)] dark:text-[hsl(210,40%,98%)]">
                Current Balance
              </label>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                className="bg-white dark:bg-[hsl(220,20%,6%)] border-[hsl(214,32%,91%)] dark:border-[hsl(220,15%,15%)] focus-visible:ring-[hsl(217,91%,60%)]"
                {...register("balance")}
              />
              {errors.balance && <p className="text-sm text-red-500">{errors.balance.message}</p>}
            </div>

            {/* Set as Default */}
            <div className="flex items-center justify-between rounded-lg border border-[hsl(214,32%,91%)] dark:border-[hsl(220,15%,15%)] bg-[hsl(210,40%,96%)] dark:bg-[hsl(220,15%,15%)] p-3">
              <div className="space-y-0.5">
                <label className="text-base font-medium cursor-pointer text-[hsl(222,47%,11%)] dark:text-[hsl(210,40%,98%)]">
                  Set as Default
                </label>
                <p className="text-sm text-[hsl(215,20%,40%)] dark:text-[hsl(215,20%,65%)]">
                  This account will be selected by default
                </p>
              </div>
              <Switch
                checked={watch("isDefault")}
                onCheckedChange={(checked) => setValue("isDefault", checked)}
                className="data-[state=checked]:bg-[hsl(217,91%,60%)]"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <DrawerClose asChild>
                <Button type="button" variant="outline" className="flex-1">
                  Cancel
                </Button>
              </DrawerClose>
              <Button
                type="submit"
                disabled={editLoading}
                className="flex-1 bg-[hsl(217,91%,60%)] hover:bg-[hsl(217,91%,52%)] text-white transition-colors duration-200 disabled:opacity-60"
              >
                {editLoading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>

          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
