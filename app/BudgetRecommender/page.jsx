import { memo } from 'react';
import { BudgetRecommender } from "@/components/ai-features/BudgetRecommender"

const Page = () => {
  return (
    <div>
      <h2>Page</h2>
        <BudgetRecommender />
    </div>
  );
};

export default memo(Page);