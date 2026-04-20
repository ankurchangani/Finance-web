import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium " +
  "transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring " +
  "disabled:pointer-events-none disabled:opacity-50 " +
  "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // ── ShadCN defaults (untouched) ───────────────────────
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground",
        link:
          "text-primary underline-offset-4 hover:underline",

        // ── Finovexa Blue Theme Variants ─────────────────────

        /**
         * "primary" — cyan → blue → indigo gradient CTA
         */
        primary:
          "relative overflow-hidden text-white font-semibold " +
          "bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 " +
          "border border-cyan-400/25 " +
          "shadow-[0_4px_22px_rgba(34,211,238,0.30),inset_0_1px_0_rgba(255,255,255,0.12)] " +
          "hover:shadow-[0_8px_36px_rgba(34,211,238,0.48),inset_0_1px_0_rgba(255,255,255,0.16)] " +
          "hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-500 " +
          "hover:scale-[1.04] hover:-translate-y-0.5 " +
          "active:scale-[0.97] active:translate-y-0 " +
          "will-change-transform transition-all duration-200 ease-out",

        /**
         * "glass" — frosted cyan glass button
         */
        glass:
          "backdrop-blur-lg " +
          "bg-[rgba(34,211,238,0.06)] border border-cyan-400/20 text-cyan-300 " +
          "shadow-[0_2px_16px_rgba(34,211,238,0.10),inset_0_1px_0_rgba(255,255,255,0.04)] " +
          "hover:bg-[rgba(34,211,238,0.12)] hover:border-cyan-400/35 hover:text-cyan-200 " +
          "hover:shadow-[0_6px_28px_rgba(34,211,238,0.20)] " +
          "hover:scale-[1.03] hover:-translate-y-0.5 " +
          "active:scale-[0.97] active:translate-y-0 " +
          "will-change-transform transition-all duration-200 ease-out",

        /**
         * "blue" — solid blue button, no gradient
         */
        blue:
          "bg-blue-600 text-white border border-blue-500/40 " +
          "shadow-[0_4px_20px_rgba(59,130,246,0.30),inset_0_1px_0_rgba(255,255,255,0.10)] " +
          "hover:bg-blue-500 " +
          "hover:shadow-[0_8px_32px_rgba(59,130,246,0.45)] " +
          "hover:scale-[1.03] hover:-translate-y-0.5 " +
          "active:scale-[0.97] active:translate-y-0 " +
          "will-change-transform transition-all duration-200 ease-out",

        /**
         * "indigo" — indigo → purple gradient
         */
        indigo:
          "text-white bg-gradient-to-r from-indigo-500 via-violet-600 to-purple-600 " +
          "border border-indigo-400/25 " +
          "shadow-[0_4px_22px_rgba(99,102,241,0.30),inset_0_1px_0_rgba(255,255,255,0.10)] " +
          "hover:shadow-[0_8px_36px_rgba(99,102,241,0.50)] " +
          "hover:scale-[1.04] hover:-translate-y-0.5 " +
          "active:scale-[0.97] active:translate-y-0 " +
          "will-change-transform transition-all duration-200 ease-out",

        /**
         * "ghost-blue" — transparent with blue border on hover
         */
        "ghost-blue":
          "bg-transparent border border-transparent text-blue-400/70 " +
          "hover:bg-blue-500/08 hover:border-blue-500/30 hover:text-blue-300 " +
          "active:scale-[0.97] " +
          "will-change-transform transition-all duration-200 ease-out",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm:      "h-8 rounded-lg px-3 text-xs",
        md:      "h-10 rounded-xl px-5",
        lg:      "h-12 rounded-xl px-8 text-base",
        icon:    "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size:    "default",
    },
  }
);

const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };