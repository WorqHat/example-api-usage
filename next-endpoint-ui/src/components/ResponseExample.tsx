import React from "react";

type ResponseExampleProps = {
  children: React.ReactNode;
};

export default function ResponseExample({ children }: ResponseExampleProps) {
  return (
    <div className="my-6 rounded-lg border border-white/10 bg-black/60 p-4">
      <div className="[&_pre]:m-0 [&_code]:bg-transparent [&_code]:text-white">
        {children}
      </div>
    </div>
  );
}

