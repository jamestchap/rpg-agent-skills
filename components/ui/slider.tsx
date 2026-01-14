"use client";

import * as React from "react";

import { cn } from "../../lib/utils";

export interface SliderProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, type = "range", ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        "h-2 w-full cursor-pointer appearance-none rounded-full bg-smoke-100 accent-brass-500",
        className
      )}
      {...props}
    />
  )
);

Slider.displayName = "Slider";
