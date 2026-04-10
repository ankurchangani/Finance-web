export const dynamic = "force-dynamic";

import { getUserAccounts } from "@/actions/dashboard";
import { defaultCategories } from "@/data/categories";
import { AddTransactionForm } from "../_components/transaction-form";
import { getTransaction } from "@/actions/transaction";

export default async function AddTransactionPage({ searchParams }) {
  const resolvedParams = await searchParams;
  const editId = resolvedParams?.edit;

  const [accounts, initialData] = await Promise.all([
    getUserAccounts(),
    editId ? getTransaction(editId) : Promise.resolve(null),
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-3xl mx-auto px-5 pt-28">
        {/* Page Header */}
        <div className="mb-8 flex flex-col items-center md:items-start gap-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-900/40 text-lg">
              {editId ? "✏️" : "➕"}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold gradient-title tracking-tight">
              {editId ? "Edit Transaction" : "Add Transaction"}
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            {editId
              ? "Update the details for this transaction"
              : "Record a new income or expense"}
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border bg-card shadow-sm px-6 py-6">
          <AddTransactionForm
            accounts={accounts}
            categories={defaultCategories}
            editMode={!!editId}
            initialData={initialData}
          />
        </div>
      </div>
    </div>
  );
}
