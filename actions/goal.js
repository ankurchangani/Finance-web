"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function createGoal(data) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (!user) throw new Error("User not found");

  const goal = await db.goal.create({
    data: {
      ...data,
      userId: user.id,
    },
  });

  return {
    ...goal,
    targetAmount: goal.targetAmount ? Number(goal.targetAmount) : 0,
    savedAmount: goal.savedAmount ? Number(goal.savedAmount) : 0,
  };
}

export async function getGoals() {
  const { userId } = await auth();
  if (!userId) return [];

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (!user) return [];

  const goals = await db.goal.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return goals.map((g) => ({
    ...g,
    targetAmount: g.targetAmount ? Number(g.targetAmount) : 0,
    savedAmount: g.savedAmount ? Number(g.savedAmount) : 0,
  }));
}