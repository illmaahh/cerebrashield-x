"use client";
import { clsx } from "clsx";
import { HTMLAttributes, forwardRef } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glow?: "green" | "blue" | "red" | "none";
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, glow = "none", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          "glass-panel rounded-xl p-4",
          {
            "shadow-[0_0_20px_rgba(0,245,160,0.1)]": glow === "green",
            "shadow-[0_0_20px_rgba(77,112,255,0.1)]": glow === "blue",
            "shadow-[0_0_20px_rgba(255,32,32,0.1)]": glow === "red",
          },
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = "Card";
