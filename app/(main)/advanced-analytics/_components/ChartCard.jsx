import { cn } from "@/lib/utils";
import { C } from "./utils";

/**
 * Dark card wrapper used around every chart / table section.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {string} [props.className]
 */
export function ChartCard({ children, className }) {
  return (
    <div
      className={cn("rounded-2xl p-5 border", className)}
      style={{ background: C.card, borderColor: C.border }}
    >
      {children}
    </div>
  );
}
