"use client";

import * as React from "react";

import { cn } from "../../lib/utils";

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, type = "checkbox", ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        "h-4 w-4 rounded border border-ink-300 text-brass-500 accent-brass-500 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass-400 focus-visible:ring-offset-2 focus-visible:ring-offset-smoke-50 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
);

Checkbox.displayName = "Checkbox";
