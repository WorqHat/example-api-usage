"use client";

import React, { Children, isValidElement } from "react";
import * as TabsPrimitive from "@/components/ui/tabs";

type TabProps = {
  children: React.ReactNode;
  title?: string;
  icon?: string;
};

type TabsProps = {
  children: React.ReactNode;
  defaultValue?: string;
};

function isTabElement(
  child: React.ReactNode
): child is React.ReactElement<TabProps> {
  if (!isValidElement(child)) {
    return false;
  }

  const props = child.props as Partial<TabProps>;
  return (
    typeof props.title !== "undefined" ||
    (typeof child.type === "function" && child.type.name === "Tab")
  );
}

export default function Tabs({ children, defaultValue }: TabsProps) {
  const childrenArray = Children.toArray(children);
  const tabs = childrenArray.filter(isTabElement);

  const firstTabValue = tabs.length > 0 && isValidElement(tabs[0]) 
    ? tabs[0].props?.title?.toLowerCase().replace(/\s+/g, '-') || 'tab-0'
    : 'tab-0';

  return (
    <TabsPrimitive.Tabs
      defaultValue={defaultValue || firstTabValue}
      className="my-6"
    >
      <TabsPrimitive.TabsList className="mb-4">
        {tabs.map((tab, index) => {
          if (!isValidElement(tab)) return null;
          const title = tab.props.title || `Tab ${index + 1}`;
          const value = title.toLowerCase().replace(/\s+/g, '-') || `tab-${index}`;
          
          return (
            <TabsPrimitive.TabsTrigger key={index} value={value}>
              {title}
            </TabsPrimitive.TabsTrigger>
          );
        })}
      </TabsPrimitive.TabsList>
      {tabs.map((tab, index) => {
        const title = tab.props.title || `Tab ${index + 1}`;
        const value = title.toLowerCase().replace(/\s+/g, '-') || `tab-${index}`;
        
        return (
          <TabsPrimitive.TabsContent key={index} value={value}>
            {tab.props.children}
          </TabsPrimitive.TabsContent>
        );
      })}
    </TabsPrimitive.Tabs>
  );
}

export function Tab({ children }: TabProps) {
  return <>{children}</>;
}

