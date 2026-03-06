// "use server";

// import aj from "@/lib/arcjet";
// import { db } from "@/lib/prisma";
// import { request } from "@arcjet/next";
// import { auth  } from "@clerk/nextjs/server";
// import { revalidatePath } from "next/cache";

// const serializeTransaction = (obj) => {
//   const serialized = { ...obj };
//   if (obj.balance) {
//     serialized.balance = obj.balance.toNumber();
//   }
//   if (obj.amount) {
//     serialized.amount = obj.amount.toNumber();
//   }
//   return serialized;
// };

// export async function getUserAccounts() {
//   try {
//     const { userId } = await auth();
//     if (!userId) throw new Error("Unauthorized");

//     const user = await db.user.findUnique({
//       where: { clerkUserId: userId },
//     });

//     // ✅ User not found તો error throw કરવાને બદલે empty array return કરો
//     if (!user) {
//       return [];
//     }

//     const accounts = await db.account.findMany({
//       where: { userId: user.id },
//       orderBy: { createdAt: "desc" },
//       include: {
//         _count: {
//           select: {
//             transactions: true,
//           },
//         },
//       },
//     });

//     return accounts.map(serializeTransaction);
//   } catch (error) {
//     console.error("getUserAccounts error:", error.message);
//     return []; // ✅ Error આવે તો empty array return કરો
//   }
// }
// export async function createAccount(data) {
//   try {
//     const { userId } = await auth();
//     if (!userId) throw new Error("Unauthorized");

//     // Get request data for ArcJet
//     const req = await request();
//     const decision = await aj.protect(req, { userId, requested: 1 });

//     if (decision.isDenied()) {
//       if (decision.reason.isRateLimit()) {
//         throw new Error("Too many requests. Please try again later.");
//       }
//       throw new Error("Request blocked");
//     }

//     // ✅ Clerk થી user info લો
//     const { userId: clerkId } = await auth();
//     const clerkUser = await currentUser(); // ← import કરો: import { currentUser } from "@clerk/nextjs/server";

//     // ✅ upsert: user હોય તો find કરો, ન હોય તો create કરો
//     const user = await db.user.upsert({
//       where: { clerkUserId: userId },
//       update: {}, // કંઈ update નહીં
//       create: {
//         clerkUserId: userId,
//         email: clerkUser.emailAddresses[0].emailAddress,
//         name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim(),
//         imageUrl: clerkUser.imageUrl,
//       },
//     });

//     // Balance validate કરો
//     const balanceFloat = parseFloat(data.balance);
//     if (isNaN(balanceFloat)) throw new Error("Invalid balance amount");

//     // First account check
//     const existingAccounts = await db.account.findMany({
//       where: { userId: user.id },
//     });

//     const shouldBeDefault = existingAccounts.length === 0 ? true : data.isDefault;

//     if (shouldBeDefault) {
//       await db.account.updateMany({
//         where: { userId: user.id, isDefault: true },
//         data: { isDefault: false },
//       });
//     }

//     const account = await db.account.create({
//       data: {
//         ...data,
//         balance: balanceFloat,
//         userId: user.id,
//         isDefault: shouldBeDefault,
//       },
//     });

//     revalidatePath("/dashboard");
//     return { success: true, data: serializeTransaction(account) };
//   } catch (error) {
//     return { success: false, error: error.message }; 
//   }
// }

// export async function getDashboardData() {
//   try {
//     const { userId } = await auth();
//     if (!userId) throw new Error("Unauthorized");

//     const user = await db.user.findUnique({
//       where: { clerkUserId: userId },
//     });

//     // ✅ User not found તો empty array return
//     if (!user) {
//       return [];
//     }

//     const transactions = await db.transaction.findMany({
//       where: { userId: user.id },
//       orderBy: { date: "desc" },
//     });

//     return transactions.map(serializeTransaction);
//   } catch (error) {
//     console.error("getDashboardData error:", error.message);
//     return [];
//   }
// }


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

// ✅ Helper: user મળે તો return કરો, ન મળે તો create કરો
async function getOrCreateUser(userId) {
  const clerkUser = await currentUser();
  if (!clerkUser) throw new Error("Clerk user not found");

  return await db.user.upsert({
    where: { clerkUserId: userId },
    update: {},
    create: {
      clerkUserId: userId,
      email: clerkUser.emailAddresses[0].emailAddress,
      name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim(),
      imageUrl: clerkUser.imageUrl,
    },
  });
}

export async function getUserAccounts() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // ✅ user upsert — DB માં ન હોય તો create કરો
    const user = await getOrCreateUser(userId);

    const accounts = await db.account.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { transactions: true },
        },
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

    // ✅ same helper વાપરો
    const user = await getOrCreateUser(userId);

    const balanceFloat = parseFloat(data.balance);
    if (isNaN(balanceFloat)) throw new Error("Invalid balance amount");

    const existingAccounts = await db.account.findMany({
      where: { userId: user.id },
    });

    const shouldBeDefault = existingAccounts.length === 0 ? true : data.isDefault;

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

    // ✅ same helper વાપરો
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