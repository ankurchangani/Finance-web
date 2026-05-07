import GoalCard from "./goal-card";

const GoalsSection = async () => {
   const goals = await getGoals();

   return (
      <section className="space-y-4">
         <p className="text-xs uppercase tracking-widest text-slate-500">
            Financial Goals
         </p>

         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {goals.map((goal) => (
               <GoalCard key={goal.id} goal={goal} />
            ))}
         </div>
      </section>
   );
};

export default GoalsSection;