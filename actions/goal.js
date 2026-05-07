"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function createGoal(data) {
  const { userId } = await auth();

  return db.goal.create({
    data: {
      ...data,
      userId,
    },
  });
}

export async function getGoals() {
  const { userId } = await auth();

  return db.goal.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}