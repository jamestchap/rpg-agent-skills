"use client";

import * as React from "react";

import { cn } from "../../lib/utils";
import { RippleButton } from "./ripple-button";

type ButtonVariant = "primary" | "secondary" | "chip" | "ghost";
type ButtonSize = "xs" | "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "border-brass-400/60 text-white shadow-sm hover:-translate-y-0.5",
  secondary:
    "border-smoke-300 bg-parchment-50 text-ink-700 shadow-sm hover:bg-smoke-100",
  chip: "rounded-full border-2 border-ink-200 text-ink-600",
  ghost: "border-transparent bg-transparent text-ink-600 hover:bg-smoke-100"
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
  ) => {
    const sizeClass = sizeStyles[size];
    const shared = cn(
      "inline-flex items-center justify-center font-semibold transition-transform duration-150 ease-out disabled:cursor-not-allowed disabled:opacity-50",
      variant === "chip" ? "rounded-full" : "rounded-xl",
      variantStyles[variant],
      sizeClass,
      className
    );

    if (variant === "primary") {
      return (
        <RippleButton
          ref={ref}
          type={type}
          rippleColor="rgba(255,255,255,0.35)"
          className={cn("bg-brass-500 text-white hover:bg-brass-400", shared)}
          {...props}
        />
      );
    }

    return (
      <RippleButton
        ref={ref}
        type={type}
        rippleColor="rgba(255,255,255,0.5)"
        className={shared}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
