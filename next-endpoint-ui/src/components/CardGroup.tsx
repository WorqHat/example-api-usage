import React from "react";

type CardGroupProps = {
  children: React.ReactNode;
  cols?: number;
};

export default function CardGroup({ children, cols = 2 }: CardGroupProps) {
  const gridCols = cols === 1 ? "grid-cols-1" : cols === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-3";
  
  return (
    <div className={`my-6 grid ${gridCols} gap-4`}>
      {children}
    </div>
  );
}


