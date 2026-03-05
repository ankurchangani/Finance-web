"use client";

import {seedTransactions} from '@/actions/seed'
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function SeedTestButton() {
  const handleSeed = async () => {
    const res = await seedTransactions({ days: 30 }); // test 30 days

    if (res.success) {
      toast.success(res.message);
      console.log(res);
    } else {
      toast.error(res.error);
      console.error(res.error);
    }
  };

  return (
    <Button onClick={handleSeed} className="bg-blue-600">
      Generate Demo Data
    </Button>
  );
}