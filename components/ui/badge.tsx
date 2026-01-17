"use client";

import * as React from "react";

import { cn } from "../../lib/utils";
import { AnimatedGradientText } from "./animated-gradient-text";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "subtle";
}

const variantStyles: Record<NonNullable<BadgeProps["variant"]>, string> = {
  default:
    "border-brass-200 bg-brass-100 text-brass-800 uppercase tracking-[0.2em]",
  subtle: "border-ink-200 bg-parchment-50 text-ink-600"
};

export function Badge({
  className,
  variant = "default",
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold shadow-sm",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {variant === "default" ? (
        <AnimatedGradientText
          className="text-xs font-semibold uppercase tracking-[0.2em]"
          colorFrom="#f0b74a"
          colorTo="#4b705c"
          speed={1.2}
        >
          {children}
        </AnimatedGradientText>
      ) : (
        children
      )}
    </span>
  );
}
