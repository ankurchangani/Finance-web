"use client";

import { ArrowUpRight, ArrowDownRight, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import useFetch from "@/hooks/use-fetch";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { updateDefaultAccount, deleteAccount } from "@/actions/account";
import { toast } from "sonner";
import { EditAccountDrawer } from "./edit-account-drawer";

export function AccountCard({ account }) {
  const { name, type, balance, id, isDefault } = account;
  // ✅ Control dropdown open state manually so we can close it programmatically
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showEditDrawer, setShowEditDrawer] = useState(false);

  // ── Update Default ──
  const {
    loading: updateDefaultLoading,
    fn: updateDefaultFn,
    data: updatedAccount,
    error: updateError,
  } = useFetch(updateDefaultAccount);

  // ── Delete Account ──
  const {
    loading: deleteLoading,
    fn: deleteFn,
    data: deleteResult,
    error: deleteError,
  } = useFetch(deleteAccount);

  const handleDefaultChange = async (event) => {
    event.preventDefault();
    if (isDefault) {
      toast.warning("At least 1 default account is required");
      return;
    }
    await updateDefaultFn(id);
  };

  const handleDelete = async (event) => {
    event.preventDefault();
    // ✅ Close dropdown first, then confirm dialog
    setDropdownOpen(false);
    if (!window.confirm(`Delete "${name}" account? This will also delete all its transactions.`)) return;
    await deleteFn(id);
  };

  const handleEdit = (event) => {
    event.preventDefault();
    // ✅ Close dropdown first, then open drawer
    setDropdownOpen(false);
    setShowEditDrawer(true);
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
    <>
      <Card className="hover:shadow-md transition-all duration-200 group relative overflow-hidden cursor-pointer">
        {/* Subtle top accent line */}
        <div
          className={`absolute top-0 left-0 right-0 h-0.5 transition-all duration-300 ${
            isDefault
              ? "bg-gradient-to-r from-violet-500 to-blue-500"
              : "bg-transparent group-hover:bg-gradient-to-r group-hover:from-violet-500/40 group-hover:to-blue-500/40"
          }`}
        />

        <Link href={`/account/${id}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium capitalize flex items-center gap-2">
              {name}
              {isDefault && (
                <span className="text-[10px] font-semibold text-violet-600 bg-violet-100 dark:bg-violet-500/10 dark:text-violet-400 px-2 py-0.5 rounded-full border border-violet-200 dark:border-violet-500/20">
                  Default
                </span>
              )}
            </CardTitle>

            <div className="flex items-center gap-1">
              <Switch
                checked={isDefault}
                onClick={handleDefaultChange}
                disabled={updateDefaultLoading}
              />

              {/* ── 3-dot Menu — controlled open state ── */}
              <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                <DropdownMenuTrigger asChild>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setDropdownOpen((prev) => !prev);
                    }}
                    className="h-8 w-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-200 ml-1 focus:outline-none"
                  >
                    <MoreVertical className="h-4 w-4 shrink-0" />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-40 shadow-lg rounded-xl p-1">

                  <DropdownMenuItem
                    onClick={handleEdit}
                    className="flex items-center gap-2 cursor-pointer rounded-lg px-3 py-2 text-sm transition-colors duration-150 hover:bg-muted"
                  >
                    <Pencil className="h-3.5 w-3.5 shrink-0" />
                    <span>Edit Account</span>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="my-1" />

                  <DropdownMenuItem
                    onClick={handleDelete}
                    disabled={deleteLoading}
                    className="flex items-center gap-2 cursor-pointer rounded-lg px-3 py-2 text-sm transition-colors duration-150 text-destructive focus:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-3.5 w-3.5 shrink-0" />
                    <span>{deleteLoading ? "Deleting..." : "Delete Account"}</span>
                  </DropdownMenuItem>

                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold tracking-tight">
              ${parseFloat(balance).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {type.charAt(0) + type.slice(1).toLowerCase()} Account
            </p>
          </CardContent>

          <CardFooter className="flex justify-between text-sm text-muted-foreground pb-4">
            <div className="flex items-center gap-1">
              <ArrowUpRight className="h-4 w-4 text-green-500 shrink-0" />
              <span>Income</span>
            </div>
            <div className="flex items-center gap-1">
              <ArrowDownRight className="h-4 w-4 text-red-500 shrink-0" />
              <span>Expense</span>
            </div>
          </CardFooter>
        </Link>
      </Card>

      {/* Edit Drawer — outside Link */}
      <EditAccountDrawer
        account={account}
        open={showEditDrawer}
        onOpenChange={setShowEditDrawer}
      />
    </>
  );
}
