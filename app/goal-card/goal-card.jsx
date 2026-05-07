"use client";

import { Target } from "lucide-react";

export function GoalCard({ goal }) {
  const progress =
    (Number(goal.savedAmount) / Number(goal.targetAmount)) * 100;

  return (
    <div className="rounded-2xl bg-slate-800/70 border border-slate-700/50 p-5">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-2xl">{goal.emoji}</p>

          <h3 className="text-white font-bold mt-2">
            {goal.title}
          </h3>

          <p className="text-xs text-slate-500 mt-1">
            ${goal.savedAmount} / ${goal.targetAmount}
          </p>
        </div>

        <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
          <Target className="w-5 h-5 text-violet-400" />
        </div>
      </div>

      <div className="h-2 rounded-full bg-slate-700 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-violet-500 to-cyan-400 transition-all duration-500"
          style={{
            width: `${Math.min(progress, 100)}%`,
          }}
        />
      </div>

      <div className="flex justify-between mt-2 text-xs">
        <span className="text-slate-400">
          {progress.toFixed(0)}% completed
        </span>

        <span className="text-emerald-400 font-bold">
          ${(goal.targetAmount - goal.savedAmount).toFixed(2)} left
        </span>
      </div>
    </div>
  );
}