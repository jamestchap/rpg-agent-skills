"use client";

import * as React from "react";

import { cn } from "../../lib/utils";

export const Container = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("mx-auto w-full max-w-6xl px-6", className)}
    {...props}
  />
));

Container.displayName = "Container";

export const Section = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => (
  <section ref={ref} className={cn("w-full", className)} {...props} />
));

Section.displayName = "Section";

export const Stack = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col gap-6", className)} {...props} />
));

Stack.displayName = "Stack";
