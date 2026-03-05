
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
    if (!window.confirm(`Delete "${name}" account? This will also delete all its transactions.`)) return;
    await deleteFn(id);
  };

  const handleEdit = (event) => {
    event.preventDefault();
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
      <Card className="hover:shadow-md transition-shadow group relative overflow-hidden">
        {/* Subtle top accent line */}
        <div className={`absolute top-0 left-0 right-0 h-0.5 ${isDefault ? "bg-gradient-to-r from-violet-500 to-blue-500" : "bg-transparent group-hover:bg-gradient-to-r group-hover:from-violet-500/40 group-hover:to-blue-500/40"} transition-all duration-300`} />

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

              {/* ── 3-dot Menu ── */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    onClick={(e) => e.preventDefault()}
                    className="h-8 w-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-200 ml-1"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem
                    onClick={handleEdit}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit Account
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleDelete}
                    disabled={deleteLoading}
                    className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    {deleteLoading ? "Deleting..." : "Delete Account"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">
              ${parseFloat(balance).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {type.charAt(0) + type.slice(1).toLowerCase()} Account
            </p>
          </CardContent>

          <CardFooter className="flex justify-between text-sm text-muted-foreground">
            <div className="flex items-center">
              <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
              Income
            </div>
            <div className="flex items-center">
              <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
              Expense
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
