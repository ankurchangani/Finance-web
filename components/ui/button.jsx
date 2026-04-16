import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // ── Shadcn defaults ──────────────────────────────────────
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

        // ── Finovexa custom variants ─────────────────────────────

        /**
         * "primary" — gradient CTA button
         * Light: vivid blue→purple on white text
         * Dark:  same gradient, slightly stronger glow
         */
        primary:
          "relative overflow-hidden border border-transparent text-white " +
          "bg-gradient-to-r from-blue-500 to-purple-600 " +
          "shadow-md shadow-blue-500/20 " +
          "hover:shadow-xl hover:shadow-blue-500/30 hover:scale-105 " +
          "active:scale-100 will-change-transform " +
          "transition-all duration-300 ease-in-out " +
          // dark mode: stronger glow
          "dark:shadow-blue-400/25 dark:hover:shadow-blue-400/40",

        /**
         * "glass" — frosted-glass secondary button
         * Light: white/10 with dark text + subtle border
         * Dark:  white/10 with white text + cyan border
         */
        glass:
          "border backdrop-blur-lg " +
          // Light mode
          "bg-sky-500/10 border-sky-400/25 text-sky-700 " +
          "hover:bg-sky-500/20 hover:border-sky-400/40 hover:text-sky-800 " +
          // Dark mode
          "dark:bg-white/10 dark:border-white/20 dark:text-white " +
          "dark:hover:bg-white/20 dark:hover:border-white/30 " +
          "hover:scale-105 active:scale-100 " +
          "will-change-transform transition-all duration-300 ease-in-out",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm:      "h-8 rounded-md px-3 text-xs",
        lg:      "h-10 rounded-md px-8",
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
