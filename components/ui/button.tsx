"use client";

import * as React from "react";

import { cn } from "../../lib/utils";

type ButtonVariant = "primary" | "secondary" | "chip" | "ghost";
type ButtonSize = "xs" | "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "border-brass-600 bg-brass-500 text-white shadow-sm hover:-translate-y-0.5 hover:bg-brass-400",
  secondary:
    "border-smoke-300 bg-parchment-50 text-ink-700 shadow-sm hover:-translate-y-0.5 hover:bg-smoke-100",
  chip:
    "rounded-full border-2 border-ink-200 text-ink-600 hover:border-ink-400",
  ghost: "border-transparent text-ink-600 hover:bg-smoke-100"
};

const sizeStyles: Record<ButtonSize, string> = {
  xs: "h-7 px-3 text-xs",
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-4 text-base"
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "secondary", size = "md", type = "button", ...props },
    ref
  ) => (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-xl border-2 font-semibold transition-transform duration-150 ease-out disabled:cursor-not-allowed disabled:opacity-50",
        variant === "chip" ? "rounded-full" : "rounded-xl",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      ref={ref}
      type={type}
      {...props}
    />
  )
);

Button.displayName = "Button";
