"use client";
import { clsx } from "clsx";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "danger" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          "inline-flex items-center justify-center font-mono font-medium transition-all duration-200 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed select-none",
          {
            "bg-cyber-500/20 border border-cyber-400/40 text-cyber-300 hover:bg-cyber-500/30 hover:border-cyber-400/70 hover:shadow-[0_0_12px_rgba(0,245,160,0.3)]":
              variant === "primary",
            "bg-threat-500/20 border border-threat-400/40 text-threat-300 hover:bg-threat-500/30 hover:border-threat-400/70 hover:shadow-[0_0_12px_rgba(255,32,32,0.3)]":
              variant === "danger",
            "bg-transparent border border-cyber-400/20 text-cyber-400/60 hover:border-cyber-400/40 hover:text-cyber-400":
              variant === "ghost",
            "bg-transparent border border-cyber-400/30 text-cyber-300 hover:bg-cyber-500/10":
              variant === "outline",
          },
          {
            "text-xs px-2.5 py-1.5 rounded": size === "sm",
            "text-sm px-4 py-2 rounded-md": size === "md",
            "text-base px-6 py-3 rounded-lg": size === "lg",
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
