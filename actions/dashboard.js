  "use server";

  import aj from "@/lib/arcjet";
  import { db } from "@/lib/prisma";
  import { request } from "@arcjet/next";
  import { auth, currentUser } from "@clerk/nextjs/server";
  import { revalidatePath } from "next/cache";

  const serializeTransaction = (obj) => {
    const serialized = { ...obj };
    if (obj.balance) serialized.balance = obj.balance.toNumber();
    if (obj.amount) serialized.amount = obj.amount.toNumber();
    return serialized;
  };

  async function getOrCreateUser(userId) {
    const clerkUser = await currentUser();
    if (!clerkUser) throw new Error("Clerk user not found");

    const email = clerkUser.emailAddresses[0]?.emailAddress;
    if (!email) throw new Error("Clerk user has no email");

    const name = `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim();
    const imageUrl = clerkUser.imageUrl;

    // Step 1: clerkUserId થી શોધો
    const byClerk = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (byClerk) {
      return await db.user.update({
        where: { clerkUserId: userId },
        data: { name, imageUrl },
      });
    }

    
    const byEmail = await db.user.findUnique({
      where: { email },
    });
    if (byEmail) {
      return await db.user.update({
        where: { email },
        data: { clerkUserId: userId, name, imageUrl },
      });
    }

    // Step 3: નવો user બનાવો
    return await db.user.create({
      data: { clerkUserId: userId, email, name, imageUrl },
    });
  }

  export async function getUserAccounts() {
    try {
      const { userId } = await auth();
      if (!userId) throw new Error("Unauthorized");

      const user = await getOrCreateUser(userId);

      const accounts = await db.account.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        include: {
          _count: { select: { transactions: true } },
        },
      });

      return accounts.map(serializeTransaction);
    } catch (error) {
      console.error("getUserAccounts error:", error.message);
      return [];
    }
  }

  export async function createAccount(data) {
    try {
      const { userId } = await auth();
      if (!userId) throw new Error("Unauthorized");

      const req = await request();
      const decision = await aj.protect(req, { userId, requested: 1 });

      if (decision.isDenied()) {
        if (decision.reason.isRateLimit()) {
          throw new Error("Too many requests. Please try again later.");
        }
        throw new Error("Request blocked");
      }

      const user = await getOrCreateUser(userId);

      const balanceFloat = parseFloat(data.balance);
      if (isNaN(balanceFloat)) throw new Error("Invalid balance amount");

      const existingAccounts = await db.account.findMany({
        where: { userId: user.id },
      });

      const shouldBeDefault =
        existingAccounts.length === 0 ? true : data.isDefault;

      if (shouldBeDefault) {
        await db.account.updateMany({
          where: { userId: user.id, isDefault: true },
          data: { isDefault: false },
        });
      }

      const account = await db.account.create({
        data: {
          ...data,
          balance: balanceFloat,
          userId: user.id,
          isDefault: shouldBeDefault,
        },
      });

      revalidatePath("/dashboard");
      return { success: true, data: serializeTransaction(account) };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  export async function getDashboardData() {
    try {
      const { userId } = await auth();
      if (!userId) throw new Error("Unauthorized");

      const user = await getOrCreateUser(userId);

      const transactions = await db.transaction.findMany({
        where: { userId: user.id },
        orderBy: { date: "desc" },
      });

      return transactions.map(serializeTransaction);
    } catch (error) {
      console.error("getDashboardData error:", error.message);
      return [];
    }
  }