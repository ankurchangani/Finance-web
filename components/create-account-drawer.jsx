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
  DrawerTrigger,
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
import { createAccount } from "@/actions/dashboard";
import { accountSchema } from "@/app/lib/schema";

export function CreateAccountDrawer({ children }) {
  const [open, setOpen] = useState(false);
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
      name: "",
      type: "CURRENT",
      balance: "",
      isDefault: false,
    },
  });

  const {
    loading: createAccountLoading,
    fn: createAccountFn,
    error,
    data: newAccount,
  } = useFetch(createAccount);

  const onSubmit = async (data) => {
    await createAccountFn(data);
  };

  // ✅ FIX: Check newAccount?.success instead of just newAccount
  // This prevents false triggers and ensures instant close on success
  useEffect(() => {
    if (newAccount?.success) {
      toast.success("Account created successfully");
      reset();
      setOpen(false);
    }
  }, [newAccount, reset]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to create account");
    }
  }, [error]);

  // Reset form when drawer closes
  const handleOpenChange = (val) => {
    if (!val) reset();
    setOpen(val);
  };

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>

      <DrawerContent className="bg-white dark:bg-[hsl(220,20%,8%)] border-t border-[hsl(214,32%,91%)] dark:border-[hsl(220,15%,15%)]">
        <DrawerHeader>
          <DrawerTitle className="text-[hsl(222,47%,11%)] dark:text-[hsl(210,40%,98%)] text-lg font-semibold">
            Create New Account
          </DrawerTitle>
        </DrawerHeader>

        <div className="px-4 pb-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* Account Name */}
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-medium text-[hsl(222,47%,11%)] dark:text-[hsl(210,40%,98%)] leading-none"
              >
                Account Name
              </label>
              <Input
                id="name"
                placeholder="e.g., Main Checking"
                className="bg-white dark:bg-[hsl(220,20%,6%)] border-[hsl(214,32%,91%)] dark:border-[hsl(220,15%,15%)] focus-visible:ring-[hsl(217,91%,60%)]"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Account Type */}
            <div className="space-y-2">
              <label
                htmlFor="type"
                className="text-sm font-medium text-[hsl(222,47%,11%)] dark:text-[hsl(210,40%,98%)] leading-none"
              >
                Account Type
              </label>
              <Select
                onValueChange={(value) => setValue("type", value)}
                defaultValue={watch("type")}
              >
                <SelectTrigger
                  id="type"
                  className="bg-white dark:bg-[hsl(220,20%,6%)] border-[hsl(214,32%,91%)] dark:border-[hsl(220,15%,15%)]"
                >
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CURRENT">Current</SelectItem>
                  <SelectItem value="SAVINGS">Savings</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-sm text-red-500">{errors.type.message}</p>
              )}
            </div>

            {/* Initial Balance */}
            <div className="space-y-2">
              <label
                htmlFor="balance"
                className="text-sm font-medium text-[hsl(222,47%,11%)] dark:text-[hsl(210,40%,98%)] leading-none"
              >
                Initial Balance
              </label>
              <Input
                id="balance"
                type="number"
                step="0.01"
                placeholder="0.00"
                className="bg-white dark:bg-[hsl(220,20%,6%)] border-[hsl(214,32%,91%)] dark:border-[hsl(220,15%,15%)] focus-visible:ring-[hsl(217,91%,60%)]"
                {...register("balance")}
              />
              {errors.balance && (
                <p className="text-sm text-red-500">{errors.balance.message}</p>
              )}
            </div>

            {/* Set as Default Toggle */}
            <div className="flex items-center justify-between rounded-lg border border-[hsl(214,32%,91%)] dark:border-[hsl(220,15%,15%)] bg-[hsl(210,40%,96%)] dark:bg-[hsl(220,15%,15%)] p-3">
              <div className="space-y-0.5">
                <label
                  htmlFor="isDefault"
                  className="text-base font-medium cursor-pointer text-[hsl(222,47%,11%)] dark:text-[hsl(210,40%,98%)]"
                >
                  Set as Default
                </label>
                <p className="text-sm text-[hsl(215,20%,40%)] dark:text-[hsl(215,20%,65%)]">
                  This account will be selected by default for transactions
                </p>
              </div>
              <Switch
                id="isDefault"
                checked={watch("isDefault")}
                onCheckedChange={(checked) => setValue("isDefault", checked)}
                className="data-[state=checked]:bg-[hsl(217,91%,60%)]"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <DrawerClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 border-[hsl(214,32%,91%)] dark:border-[hsl(220,15%,15%)]"
                >
                  Cancel
                </Button>
              </DrawerClose>

              <Button
                type="submit"
                disabled={createAccountLoading}
                className="flex-1 bg-[hsl(217,91%,60%)] hover:bg-[hsl(217,91%,52%)] text-white font-medium transition-colors duration-200 disabled:opacity-60"
              >
                {createAccountLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </div>

          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
