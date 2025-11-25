"use client";

import React from "react";

import { cn } from "@/lib/utils";
import * as AccordionPrimitive from "@/components/ui/accordion";

type AccordionGroupProps = React.ComponentProps<
  typeof AccordionPrimitive.Accordion
>;

export default function AccordionGroup({
  children,
  className,
  ...props
}: AccordionGroupProps) {
  return (
    <AccordionPrimitive.Accordion
      className={cn("my-6 space-y-2", className)}
      {...props}
    >
      {children}
    </AccordionPrimitive.Accordion>
  );
}

type AccordionProps = {
  children: React.ReactNode;
  title: string;
  value?: string;
};

export function Accordion({ children, title, value }: AccordionProps) {
  const accordionValue = value || title.toLowerCase().replace(/\s+/g, "-");

  return (
    <AccordionPrimitive.AccordionItem value={accordionValue}>
      <AccordionPrimitive.AccordionTrigger>
        {title}
      </AccordionPrimitive.AccordionTrigger>
      <AccordionPrimitive.AccordionContent>
        {children}
      </AccordionPrimitive.AccordionContent>
    </AccordionPrimitive.AccordionItem>
  );
}

